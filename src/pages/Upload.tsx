import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

const Upload = () => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError("Please upload a CSV file");
        setUploadState("error");
        return;
      }
      setFileName(file.name);
      simulateUpload();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError("Please upload a CSV file");
        setUploadState("error");
        return;
      }
      setFileName(file.name);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadState("uploading");
    setProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadState("processing");
          simulateProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateProcessing = () => {
    // Simulate AI processing
    setTimeout(() => {
      setUploadState("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {uploadState === "idle" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-3xl p-16 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <UploadIcon className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Upload Bank Statement</h2>
            <p className="text-muted-foreground mb-2">Drag & drop your CSV file here</p>
            <p className="text-sm text-muted-foreground mb-6">or click to browse</p>
            <Button variant="outline">Choose File</Button>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-8">
              🔒 Your data never leaves your device
            </p>
          </div>
        )}

        {uploadState === "uploading" && (
          <div className="bg-card rounded-3xl p-12 text-center border border-border">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold mb-4">Uploading {fileName}</h2>
            <div className="w-full bg-secondary rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        {uploadState === "processing" && (
          <div className="bg-card rounded-3xl p-12 text-center border border-border">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-accent mx-auto animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Analyzing Your Transactions</h2>
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Parsing CSV data</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Categorizing with AI</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <div className="w-5 h-5 rounded-full border-2 border-muted" />
                <span>Generating insights</span>
              </div>
            </div>
          </div>
        )}

        {uploadState === "success" && (
          <div className="bg-card rounded-3xl p-12 text-center border border-border">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Analysis Complete!</h2>
            <div className="space-y-2 mb-8">
              <p className="text-muted-foreground">✓ 127 transactions processed</p>
              <p className="text-muted-foreground">✓ Jan 1 - Jan 31, 2024</p>
              <p className="text-muted-foreground">✓ Total spent: £2,847.50</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Redirecting to dashboard...</p>
            <Button onClick={() => navigate("/dashboard")} size="lg">
              View Dashboard
            </Button>
          </div>
        )}

        {uploadState === "error" && (
          <div className="bg-card rounded-3xl p-12 text-center border border-destructive">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Upload Failed</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              <p>💡 Make sure your file is:</p>
              <p>• A CSV format (.csv extension)</p>
              <p>• From a supported bank</p>
              <p>• Contains transaction data</p>
            </div>
            <Button onClick={() => setUploadState("idle")} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
