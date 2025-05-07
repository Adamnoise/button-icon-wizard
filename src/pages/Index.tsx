
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
        
        {/* Demo Card 1 - All buttons with Lucide */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Lucide Icons</CardTitle>
                <CardDescription className="text-slate-400">Default icon set</CardDescription>
              </div>
              <Badge className="bg-blue-600">Lucide</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>Using the default Lucide React icons.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
                iconType="lucide"
                viewIcon="Eye"
                editIcon="Edit"
                approveIcon="Check" 
                deleteIcon="Trash"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Card 2 - Heroicons */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Heroicons</CardTitle>
                <CardDescription className="text-slate-400">Tailwind's icon set</CardDescription>
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-500">Heroicons</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>Using Heroicons by Tailwind CSS.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
                iconType="heroicons-solid"
                viewIcon="EyeIcon"
                editIcon="PencilIcon"
                approveIcon="CheckIcon"
                deleteIcon="TrashIcon"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Card 3 - FontAwesome */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Font Awesome</CardTitle>
                <CardDescription className="text-slate-400">Popular icon library</CardDescription>
              </div>
              <Badge className="bg-green-800 text-green-200">FontAwesome</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>Using Font Awesome icons.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
                iconType="fontawesome"
                viewIcon="Eye"
                editIcon="PenToSquare"
                approveIcon="Check"
                deleteIcon="TrashCan"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Card 4 - Material Icons */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Material Icons</CardTitle>
                <CardDescription className="text-slate-400">Google's Material Design icons</CardDescription>
              </div>
              <Badge className="bg-purple-800 text-purple-200">Material UI</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-slate-300">
                <p>Using Material Design icons.</p>
              </div>
              <ActionButtons
                onView={handleView}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onDelete={handleDelete}
                iconType="material"
                viewIcon="Visibility"
                editIcon="Edit"
                approveIcon="CheckCircle"
                deleteIcon="Delete"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
