
import ActionButtons from "@/components/ActionButtons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  // Example action handlers
  const handleView = () => toast.info("View action clicked");
  const handleEdit = () => toast.info("Edit action clicked");
  const handleApprove = () => toast.success("Item approved");
  const handleDelete = () => toast.error("Item deleted");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Action Buttons Example</h1>
        
        {/* Demo Card 1 - All buttons */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Complete Example</CardTitle>
                <CardDescription className="text-slate-400">All action buttons enabled</CardDescription>
              </div>
              <Badge className="bg-blue-600">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>This example shows all action buttons with tooltips.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Card 2 - Selective buttons */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">View & Edit Only</CardTitle>
                <CardDescription className="text-slate-400">Limited actions available</CardDescription>
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-500">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>This example shows only view and edit buttons.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Card 3 - Disabled buttons */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">With Disabled Actions</CardTitle>
                <CardDescription className="text-slate-400">Some actions are disabled</CardDescription>
              </div>
              <Badge className="bg-red-800 text-red-200">Locked</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>This example shows buttons with some disabled.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
                disabledActions={["edit", "delete"]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
