import { useState, useCallback, useRef, useEffect } from 'react';
import { FigmaApiService, FigmaApiError } from '../services/figmaApi';
import type { 
  FigmaFile, 
  FigmaNode, 
  FigmaComponent, 
  FigmaStyle,
  ConversionConfig,
  DEFAULT_CONVERSION_CONFIG 
} from '../types/figma';

interface UseFigmaApiOptions {
  timeoutMs?: number;
  retry?: {
    attempts: number;
    delayMs: number;
    backoffMultiplier?: number;
  };
}

interface UseFigmaApiState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export const useFigmaApi = (options?: UseFigmaApiOptions) => {
  const [state, setState] = useState<UseFigmaApiState>({
    isLoading: false,
    error: null,
    data: null,
  });

  // Create service instance once and reuse
  const serviceRef = useRef<FigmaApiService>(
    new FigmaApiService(undefined, options)
  );

  const setToken = useCallback((token: string) => {
    try {
      serviceRef.current.setToken(token);
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Invalid token' 
      }));
    }
  }, []);

  const clearToken = useCallback(() => {
    serviceRef.current.clearToken();
    setState({ isLoading: false, error: null, data: null });
  }, []);

  const hasToken = useCallback(() => {
    return serviceRef.current.hasToken();
  }, []);

  const makeApiCall = useCallback(async <T>(
    apiCall: (service: FigmaApiService) => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: FigmaApiError | Error) => void
  ) => {
    if (!serviceRef.current.hasToken()) {
      const error = 'No Figma API token configured';
      setState(prev => ({ ...prev, error }));
      onError?.(new Error(error));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await apiCall(serviceRef.current);
      setState(prev => ({ ...prev, isLoading: false, data: result, error: null }));
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof FigmaApiError 
        ? `API Error: ${error.message}` 
        : error instanceof Error 
          ? error.message 
          : 'Unknown error occurred';
      
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      onError?.(error as FigmaApiError | Error);
      return null;
    }
  }, []);

  // Convenience methods for common API calls
  const getFile = useCallback(async (
    fileId: string,
    options?: Parameters<FigmaApiService['getFile']>[1],
    callbacks?: {
      onSuccess?: (data: FigmaFile) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getFile(fileId, options),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getImages = useCallback(async (
    fileId: string,
    nodeIds: string[],
    options?: Parameters<FigmaApiService['getImages']>[2],
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getImages(fileId, nodeIds, options),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getFileNodes = useCallback(async (
    fileId: string,
    nodeIds: string[],
    options?: Parameters<FigmaApiService['getFileNodes']>[2],
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getFileNodes(fileId, nodeIds, options),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getComments = useCallback(async (
    fileId: string,
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getComments(fileId),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getVersions = useCallback(async (
    fileId: string,
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getVersions(fileId),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getFileComponents = useCallback(async (
    fileId: string,
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getFileComponents(fileId),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getFileStyles = useCallback(async (
    fileId: string,
    callbacks?: {
      onSuccess?: (data: any) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getFileStyles(fileId),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const extractComponents = useCallback(async (
    fileId: string,
    options?: Parameters<FigmaApiService['extractComponents']>[1],
    callbacks?: {
      onSuccess?: (data: FigmaComponent[]) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.extractComponents(fileId, options),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const getDesignTokens = useCallback(async (
    fileId: string,
    callbacks?: {
      onSuccess?: (data: {
        colors: FigmaStyle[];
        typography: FigmaStyle[];
        effects: FigmaStyle[];
        grids: FigmaStyle[];
      }) => void;
      onError?: (error: FigmaApiError | Error) => void;
    }
  ) => {
    return makeApiCall(
      (service) => service.getDesignTokens(fileId),
      callbacks?.onSuccess,
      callbacks?.onError
    );
  }, [makeApiCall]);

  const analyzeNodeHierarchy = useCallback((node: FigmaNode) => {
    return serviceRef.current.analyzeNodeHierarchy(node);
  }, []);

  const generateConversionSuggestions = useCallback((
    node: FigmaNode,
    config?: ConversionConfig
  ) => {
    return serviceRef.current.generateConversionSuggestions(node, config);
  }, []);

  // Utility methods
  const extractFileId = useCallback((url: string) => {
    return serviceRef.current.extractFileId(url);
  }, []);

  const validateToken = useCallback((token: string) => {
    return serviceRef.current.validateToken(token);
  }, []);

  const validateUrl = useCallback((url: string) => {
    return serviceRef.current.validateUrl(url);
  }, []);

  const extractNodeId = useCallback((url: string) => {
    return serviceRef.current.extractNodeId(url);
  }, []);

  return {
    // State
    ...state,
    
    // Token management
    setToken,
    clearToken,
    hasToken,
    
    // Basic API methods
    getFile,
    getImages,
    getFileNodes,
    getComments,
    getVersions,
    makeApiCall,
    
    // Advanced API methods
    getFileComponents,
    getFileStyles,
    extractComponents,
    getDesignTokens,
    
    // Analysis methods
    analyzeNodeHierarchy,
    generateConversionSuggestions,
    
    // Utilities
    extractFileId,
    validateToken,
    validateUrl,
    extractNodeId,
  };
};

// Enhanced example usage component showing design-to-code workflow
export const EnhancedFigmaComponent = () => {
  const [token, setTokenInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedNode, setSelectedNode] = useState<FigmaNode | null>(null);
  const [designTokens, setDesignTokens] = useState<any>(null);
  const [conversionConfig, setConversionConfig] = useState<ConversionConfig>(DEFAULT_CONVERSION_CONFIG);
  
  const {
    isLoading,
    error,
    data,
    setToken,
    hasToken,
    getFile,
    extractFileId,
    validateToken,
    getDesignTokens,
    analyzeNodeHierarchy,
    generateConversionSuggestions,
    extractComponents,
  } = useFigmaApi({
    timeoutMs: 20000,
    retry: { attempts: 3, delayMs: 500 }
  });

  const handleTokenSubmit = () => {
    if (!validateToken(token)) {
      alert('Invalid token format. Expected: figd_...');
      return;
    }
    setToken(token);
  };

  const handleFileLoad = async () => {
    const fileId = extractFileId(fileUrl);
    if (!fileId) {
      alert('Invalid Figma URL');
      return;
    }

    await getFile(fileId, undefined, {
      onSuccess: (fileData) => {
        console.log('File loaded successfully:', fileData.name);
        // Load design tokens as well
        loadDesignTokens(fileId);
      },
      onError: (error) => {
        console.error('Failed to load file:', error.message);
      }
    });
  };

  const loadDesignTokens = async (fileId: string) => {
    await getDesignTokens(fileId, {
      onSuccess: (tokens) => {
        setDesignTokens(tokens);
        console.log('Design tokens loaded:', tokens);
      },
      onError: (error) => {
        console.warn('Failed to load design tokens:', error.message);
      }
    });
  };

  const handleNodeAnalysis = (node: FigmaNode) => {
    const analysis = analyzeNodeHierarchy(node);
    const suggestions = generateConversionSuggestions(node, conversionConfig);
    
    console.log('Node Analysis:', analysis);
    console.log('Conversion Suggestions:', suggestions);
    
    setSelectedNode(node);
  };

  const handleExtractComponents = async () => {
    if (!data) return;
    
    const fileId = extractFileId(fileUrl);
    if (!fileId) return;

    await extractComponents(fileId, {
      nameFilter: 'Button', // Example filter
      includeVariants: true
    }, {
      onSuccess: (components) => {
        console.log('Extracted components:', components);
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Enhanced Figma Design-to-Code Tool</h2>
      
      {/* Token Setup */}
      {!hasToken() && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">API Token Setup</h3>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Enter Figma API token (figd_...)"
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button 
              onClick={handleTokenSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Set Token
            </button>
          </div>
        </div>
      )}
      
      {/* File Loading */}
      {hasToken() && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Load Figma File</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Figma file URL"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button 
              onClick={handleFileLoad} 
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load File'}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* File Info & Actions */}
      {data && (
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{data.name}</h3>
              <p className="text-gray-600">Last Modified: {data.lastModified}</p>
              {data.thumbnailUrl && (
                <img src={data.thumbnailUrl} alt="thumbnail" className="mt-2 w-32 h-20 object-cover rounded" />
              )}
            </div>
            <button 
              onClick={handleExtractComponents}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Extract Components
            </button>
          </div>

          {/* Node Analysis */}
          {data.document && (
            <div className="mt-4">
              <button 
                onClick={() => handleNodeAnalysis(data.document)}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Analyze Document Structure
              </button>
            </div>
          )}
        </div>
      )}

      {/* Design Tokens */}
      {designTokens && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Design System</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-sm">Colors</h4>
              <p className="text-gray-600">{designTokens.colors?.length || 0} styles</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Typography</h4>
              <p className="text-gray-600">{designTokens.typography?.length || 0} styles</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Effects</h4>
              <p className="text-gray-600">{designTokens.effects?.length || 0} styles</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Grids</h4>
              <p className="text-gray-600">{designTokens.grids?.length || 0} styles</p>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Config */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Conversion Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Framework</label>
            <select 
              value={conversionConfig.framework}
              onChange={(e) => setConversionConfig(prev => ({ 
                ...prev, 
                framework: e.target.value as ConversionConfig['framework']
              }))}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CSS Framework</label>
            <select 
              value={conversionConfig.cssFramework}
              onChange={(e) => setConversionConfig(prev => ({ 
                ...prev, 
                cssFramework: e.target.value as ConversionConfig['cssFramework']
              }))}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="bootstrap">Bootstrap</option>
              <option value="custom">Custom CSS</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={conversionConfig.responsive}
                onChange={(e) => setConversionConfig(prev => ({ 
                  ...prev, 
                  responsive: e.target.checked
                }))}
                className="mr-2"
              />
              Responsive
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};/>
          <button onClick={handleFileLoad} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load File'}
          </button>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {data && (
        <div style={{ marginTop: '10px' }}>
          <h3>File: {data.name}</h3>
          <p>Last Modified: {data.lastModified}</p>
          <p>Thumbnail: <img src={data.thumbnailUrl} alt="thumbnail" width="100" /></p>
        </div>
      )}
    </div>
  );
};