import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { dataService } from '@/services';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdvisoryConsole() {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedDraft = await dataService.generateAdvisory(prompt);
      setDraft(generatedDraft);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate advisory draft.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!draft.trim()) return;

    setIsSending(true);
    try {
      // Mock publish action
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Advisory Published",
        description: "The public health advisory has been broadcasted.",
      });
      setPrompt('');
      setDraft('');
    } catch (error) {
      toast({
        title: "Publish Failed",
        description: "Failed to publish advisory.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Public Advisory Console</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Input</CardTitle>
            <CardDescription>
              Describe the situation to generate a public health advisory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Situation Description</Label>
              <Textarea
                id="prompt"
                placeholder="E.g., Smog levels expected to rise significantly next Tuesday due to weather inversion..."
                className="h-40"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Draft
            </Button>
          </CardContent>
        </Card>

        <Card className={!draft ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle>Draft Preview</CardTitle>
            <CardDescription>
              Review and edit the AI-generated advisory before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="draft">Advisory Content</Label>
              <Textarea
                id="draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="h-40 font-mono text-sm"
                placeholder="Generated draft will appear here..."
                disabled={!draft}
              />
            </div>
            <Button 
              onClick={handlePublish} 
              disabled={!draft.trim() || isSending}
              variant="default"
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Advisory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
