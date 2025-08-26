import { FigmaFile, FigmaFileResponse } from '../types/figma';

export class FigmaApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'FigmaApiError';
  }
}

export class FigmaApiService {
  private apiToken: string = '';
  private baseUrl = 'https://api.figma.com/v1';

  constructor(token?: string) {
    if (token) {
      this.apiToken = token;
    }
  }

  setToken(token: string): void {
    this.apiToken = token;
  }

  validateToken(token: string): boolean {
    // Figma tokens typically start with 'figd_' and are around 40-50 characters
    return /^figd_[A-Za-z0-9_-]{30,50}$/.test(token.trim());
  }

  validateUrl(url: string): boolean {
    const figmaUrlPattern = /^https:\/\/(?:www\.)?figma\.com\/(file|design)\/([a-zA-Z0-9]+)/;
    return figmaUrlPattern.test(url.trim());
  }

  extractFileId(url: string): string | null {
    const match = url.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  async getFile(fileId: string): Promise<FigmaFile> {
    if (!this.apiToken) {
      throw new FigmaApiError('API token is required', 401);
    }

    if (!fileId) {
      throw new FigmaApiError('File ID is required', 400);
    }

    try {
      const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
        headers: {
          'X-Figma-Token': this.apiToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new FigmaApiError(
          this.getErrorMessage(response.status, errorData),
          response.status,
          errorData
        );
      }

      const data: FigmaFileResponse = await response.json();
      
      if (data.error) {
        throw new FigmaApiError(
          data.err || 'Unknown API error',
          data.status || 500,
          data
        );
      }

      return {
        name: data.name,
        role: data.role || 'viewer',
        lastModified: data.lastModified,
        editorType: data.editorType || 'figma',
        thumbnailUrl: data.thumbnailUrl,
        version: data.version,
        document: data.document,
        components: data.components,
        componentSets: data.componentSets || {},
        schemaVersion: data.schemaVersion,
        styles: data.styles,
        mainFileKey: data.mainFileKey,
        branches: data.branches,
      };
    } catch (error) {
      if (error instanceof FigmaApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new FigmaApiError('Network error: Unable to connect to Figma API', 0);
      }

      throw new FigmaApiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  async getFileNodes(fileId: string, nodeIds: string[]): Promise<any> {
    if (!this.apiToken) {
      throw new FigmaApiError('API token is required', 401);
    }

    if (!fileId || nodeIds.length === 0) {
      throw new FigmaApiError('File ID and node IDs are required', 400);
    }

    try {
      const idsParam = nodeIds.join(',');
      const response = await fetch(
        `${this.baseUrl}/files/${fileId}/nodes?ids=${encodeURIComponent(idsParam)}`,
        {
          headers: {
            'X-Figma-Token': this.apiToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new FigmaApiError(
          this.getErrorMessage(response.status, errorData),
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data.nodes;
    } catch (error) {
      if (error instanceof FigmaApiError) {
        throw error;
      }

      throw new FigmaApiError(`Failed to fetch nodes: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  async getImages(fileId: string, nodeIds: string[], options: { format?: 'jpg' | 'png' | 'svg' | 'pdf'; scale?: number } = {}): Promise<Record<string, string>> {
    if (!this.apiToken) {
      throw new FigmaApiError('API token is required', 401);
    }

    try {
      const params = new URLSearchParams({
        ids: nodeIds.join(','),
        format: options.format || 'png',
        scale: String(options.scale || 1),
      });

      const response = await fetch(
        `${this.baseUrl}/images/${fileId}?${params}`,
        {
          headers: {
            'X-Figma-Token': this.apiToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new FigmaApiError(
          this.getErrorMessage(response.status, errorData),
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return data.images;
    } catch (error) {
      if (error instanceof FigmaApiError) {
        throw error;
      }

      throw new FigmaApiError(`Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  private getErrorMessage(status: number, errorData?: any): string {
    switch (status) {
      case 400:
        return 'Bad request - Invalid file ID or parameters';
      case 401:
        return 'Unauthorized - Invalid or missing API token';
      case 403:
        return 'Forbidden - Insufficient permissions or file is private';
      case 404:
        return 'File not found - Check if the file ID is correct and accessible';
      case 429:
        return 'Rate limit exceeded - Please try again later';
      case 500:
        return 'Figma server error - Please try again later';
      default:
        return errorData?.err || errorData?.message || `HTTP ${status} error`;
    }
  }

  // Utility methods
  isValidFileKey(key: string): boolean {
    return /^[a-zA-Z0-9]{22,25}$/.test(key);
  }

  parseFileUrl(url: string): { fileId: string; nodeId?: string } | null {
    const figmaUrlPattern = /^https:\/\/(?:www\.)?figma\.com\/(file|design)\/([a-zA-Z0-9]+)(?:\/[^?]*)?(?:\?[^#]*)?(?:#(.*))?$/;
    const match = url.match(figmaUrlPattern);

    if (!match) {
      return null;
    }

    const [, , fileId, hash] = match;
    let nodeId: string | undefined;

    if (hash) {
      // Extract node ID from hash (usually in format like "123:456")
      const nodeMatch = hash.match(/(\d+:\d+)/);
      if (nodeMatch) {
        nodeId = nodeMatch[1];
      }
    }

    return { fileId, nodeId };
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test with a simple API call that doesn't require a specific file
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'X-Figma-Token': this.apiToken,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}