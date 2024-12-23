"use client";
import React, { useRef, useState, useEffect } from "react";
import SelectLanguages, { selectedLanguageOptionProps } from "./SelectLanguages";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Loader, Play } from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import { compileCode } from "@/actions/compile";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface CodeSnippetsProps {
  [key: string]: string;
}

type Props = {
  currentQuestionId: string;
  onQuestionChange: (question: any) => void;
  onTestComplete: (shouldReattempt: boolean, previousCode?: string) => void;
  initialStoredCode?: string | null;
};

export default function EditorComponent({ 
  currentQuestionId, 
  onQuestionChange, 
  onTestComplete,
  initialStoredCode
}: Props) {
  const { theme } = useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const { markTestAsCompleted, testStatus } = useAuth();
  const [languageOption, setLanguageOption] = useState(languageOptions[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [err, setErr] = useState(false);
  const editorRef = useRef(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showReattemptDialog, setShowReattemptDialog] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<any>(null);

  useEffect(() => {
    setSourceCode(initialStoredCode || codeSnippets[languageOption.language]);
  }, [initialStoredCode, languageOption]);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleOnchange(value: string | undefined) {
    if (value) {
      setSourceCode(value);
    }
  }

  function onSelect(value: selectedLanguageOptionProps) {
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
  }

  async function executeCode() {
    setLoading(true);
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [{ content: sourceCode }],
    };
    try {
      const result = await compileCode(requestData);
      setOutput(result.run.output.split("\n"));
      setLoading(false);
      setErr(false);
      toast.success("Compiled Successfully");
    } catch (error) {
      setErr(true);
      setLoading(false);
      toast.error("Failed to compile the Code");
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/coding-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestionId,
          code: sourceCode,
          language: languageOption.language,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit code');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      toast.success("Code submitted successfully");

      if (data.isComplete) {
        if (testStatus.attemptsRemaining > 0) {
          setSubmissionResponse(data);
          setShowReattemptDialog(true);
        } else {
          markTestAsCompleted();
          router.push('/test-complete');
        }
      } else if (data.nextQuestion) {
        setSourceCode(codeSnippets[languageOption.language]);
        onQuestionChange(data.nextQuestion);
      }
    } catch (error) {
      toast.error("Failed to submit code. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReattempt = () => {
    setShowReattemptDialog(false);
    onTestComplete(true, sourceCode);
  };

  const handleFinishTest = () => {
    markTestAsCompleted();
    router.push('/test-complete');
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Codex
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-[230px]">
            <SelectLanguages
              onSelect={onSelect}
              selectedLanguageOption={languageOption}
            />
          </div>
        </div>
      </div>

      {/* EDITOR */}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border dark:bg-slate-900"
        >
          <ResizablePanel defaultSize={50} minSize={35}>
            <Editor
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              height="100vh"
              defaultLanguage={languageOption.language}
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              value={sourceCode}
              onChange={handleOnchange}
              language={languageOption.language}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={35}>
            {/* Output Panel */}
            <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
              <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-6 py-2">
                <h2>Output</h2>
                {loading ? (
                  <Button
                    disabled
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                  >
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span>Running please wait...</span>
                  </Button>
                ) : (
                  <Button
                    onClick={executeCode}
                    size={"sm"}
                    className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    <span>Run</span>
                  </Button>
                )}
              </div>
              <div className="px-6 space-y-2">
                {err ? (
                  <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                    <p className="text-xs">
                      Failed to Compile the Code, Please try again!
                    </p>
                  </div>
                ) : (
                  <>
                    {output.map((item) => (
                      <p className="text-sm" key={item}>
                        {item}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Submit Code Button */}
      <div className="mt-4 flex justify-between">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Code"}
        </Button>
      </div>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={(open) => setShowErrorDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submission Error</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Something went wrong while submitting your code. Please try again later.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reattempt Dialog */}
      <AlertDialog open={showReattemptDialog} onOpenChange={setShowReattemptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Progress</AlertDialogTitle>
            <AlertDialogDescription>
              {submissionResponse?.attemptsRemaining > 0
                ? "You have an opportunity to reattempt this test."
                : "You have completed your test attempts."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {submissionResponse?.attemptsRemaining > 0 && (
              <AlertDialogAction onClick={handleReattempt}>Reattempt Test</AlertDialogAction>
            )}
            <AlertDialogCancel onClick={handleFinishTest}>Finish Test</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
