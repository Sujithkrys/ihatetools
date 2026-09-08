"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Loader2, RefreshCw, AlertCircle, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from "pdf-lib";

interface FormFieldItem {
  id: string;
  name: string;
  type: "text" | "checkbox" | "dropdown" | "radio" | "unknown";
  value: string | boolean;
  options?: string[];
  isMultiline?: boolean;
}

export function FillPdfFormWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fields, setFields] = useState<FormFieldItem[]>([]);
  const [hasNoFields, setHasNoFields] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [flattenOnSave, setFlattenOnSave] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const uploaded = acceptedFiles[0];
    setFile(uploaded);
    setErrorMsg("");
    setDownloadUrl(null);
    setHasNoFields(false);
    setIsProcessing(true);

    try {
      const buffer = await uploaded.arrayBuffer();
      setPdfBytes(buffer);

      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      let form;
      try {
        form = pdfDoc.getForm();
      } catch {
        form = null;
      }

      if (!form) {
        setHasNoFields(true);
        setFields([]);
        setIsProcessing(false);
        return;
      }

      const docFields = form.getFields();
      if (!docFields || docFields.length === 0) {
        setHasNoFields(true);
        setFields([]);
        setIsProcessing(false);
        return;
      }

      const parsedFields: FormFieldItem[] = [];
      docFields.forEach((field, index) => {
        const name = field.getName() || `Field_${index + 1}`;
        if (field instanceof PDFTextField) {
          parsedFields.push({
            id: `${name}_${index}`,
            name,
            type: "text",
            value: field.getText() || "",
            isMultiline: field.isMultiline(),
          });
        } else if (field instanceof PDFCheckBox) {
          parsedFields.push({
            id: `${name}_${index}`,
            name,
            type: "checkbox",
            value: field.isChecked(),
          });
        } else if (field instanceof PDFDropdown) {
          parsedFields.push({
            id: `${name}_${index}`,
            name,
            type: "dropdown",
            value: (field.getSelected() && field.getSelected()[0]) || "",
            options: field.getOptions(),
          });
        } else if (field instanceof PDFRadioGroup) {
          parsedFields.push({
            id: `${name}_${index}`,
            name,
            type: "radio",
            value: field.getSelected() || "",
            options: field.getOptions(),
          });
        } else {
          parsedFields.push({
            id: `${name}_${index}`,
            name,
            type: "unknown",
            value: "",
          });
        }
      });

      setFields(parsedFields);
      setHasNoFields(parsedFields.length === 0);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to load PDF form fields.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleFieldChange = (id: string, newVal: string | boolean) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value: newVal } : f))
    );
  };

  const handleSaveAndDownload = async () => {
    if (!pdfBytes) return;
    setIsSaving(true);
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const form = pdfDoc.getForm();

      for (const item of fields) {
        try {
          if (item.type === "text") {
            const field = form.getTextField(item.name);
            field.setText(String(item.value || ""));
          } else if (item.type === "checkbox") {
            const field = form.getCheckBox(item.name);
            if (item.value) {
              field.check();
            } else {
              field.uncheck();
            }
          } else if (item.type === "dropdown") {
            const field = form.getDropdown(item.name);
            if (item.value) {
              field.select(String(item.value));
            }
          } else if (item.type === "radio") {
            const field = form.getRadioGroup(item.name);
            if (item.value) {
              field.select(String(item.value));
            }
          }
        } catch (e) {
          console.warn(`Could not update field ${item.name}:`, e);
        }
      }

      if (flattenOnSave) {
        form.flatten();
      }

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to fill and export PDF form.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPdfBytes(null);
    setFields([]);
    setHasNoFields(false);
    setErrorMsg("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-[var(--primary)] bg-[var(--surface-hover)]"
              : "border-[var(--border)] hover:border-[var(--ink)] bg-[var(--surface)]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)]">
                Choose a fillable PDF form
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Drag & drop your PDF file here, or click to browse
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--paper)] border border-[var(--border)] text-[var(--ink-muted)]">
              Interactive AcroForm fields (Text, Checkboxes, Dropdowns)
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center space-x-3 truncate">
              <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <div className="truncate">
                <p className="font-semibold text-[var(--ink)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {fields.length} field{fields.length === 1 ? "" : "s"} detected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetAll}
                className="px-3 py-1.5 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Change PDF
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing ? (
            <div className="p-12 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
              <p className="mt-3 text-sm text-[var(--ink-muted)]">Scanning PDF form fields...</p>
            </div>
          ) : hasNoFields ? (
            <div className="p-8 text-center bg-[var(--surface)] rounded-xl border border-[var(--border)] space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="font-bold text-[var(--ink)] text-lg">No Fillable Form Fields Detected</h4>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                  This PDF does not contain standard interactive AcroForm fields. Many forms are scanned static images or flattened print layouts without digital form metadata.
                </p>
              </div>
              <button
                onClick={resetAll}
                className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Another PDF
              </button>
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <h3 className="font-bold text-lg text-[var(--ink)]">Form Fields</h3>
                <span className="text-xs text-[var(--ink-muted)]">
                  Edit values below and export your completed document
                </span>
              </div>

              {/* Fields List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={`p-3.5 rounded-lg border border-[var(--border)] bg-[var(--paper)] space-y-1.5 ${
                      field.isMultiline ? "md:col-span-2" : ""
                    }`}
                  >
                    <label className="text-xs font-semibold text-[var(--ink)] block truncate" title={field.name}>
                      {field.name}
                    </label>

                    {field.type === "text" && (
                      field.isMultiline ? (
                        <textarea
                          rows={3}
                          value={String(field.value)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.name}...`}
                          className="w-full text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(field.value)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.name}...`}
                          className="w-full text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                        />
                      )
                    )}

                    {field.type === "checkbox" && (
                      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={Boolean(field.value)}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span className="text-xs text-[var(--ink-muted)]">
                          {field.value ? "Checked (True)" : "Unchecked (False)"}
                        </span>
                      </label>
                    )}

                    {field.type === "dropdown" && (
                      <select
                        value={String(field.value)}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full text-sm p-2 bg-[var(--surface)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                      >
                        <option value="">-- Select option --</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "radio" && (
                      <div className="flex flex-wrap gap-3 pt-1">
                        {field.options?.map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-1.5 text-xs text-[var(--ink)] cursor-pointer">
                            <input
                              type="radio"
                              name={field.id}
                              value={opt}
                              checked={field.value === opt}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              className="text-[var(--primary)]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {field.type === "unknown" && (
                      <p className="text-xs text-[var(--ink-muted)] italic">
                        Unsupported field type
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Controls */}
              <div className="border-t border-[var(--border)] pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flatten-checkbox"
                    checked={flattenOnSave}
                    onChange={(e) => setFlattenOnSave(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)]"
                  />
                  <label htmlFor="flatten-checkbox" className="text-xs text-[var(--ink-muted)] cursor-pointer">
                    Flatten form fields (make filled values permanent, preventing further editing)
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={handleSaveAndDownload}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Save & Fill PDF
                  </button>

                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download={`filled_${file.name}`}
                      className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Download Filled PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Note / Disclaimer */}
              <div className="p-3 bg-[var(--paper)] border border-[var(--border)] rounded-lg text-xs text-[var(--ink-muted)]">
                <strong>Technical Notice:</strong> PDF form support relies on standard AcroForm structures via pdf-lib. Complex dynamic XFA forms (proprietary Adobe XML forms) or heavily obfuscated field encodings may have limitations.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
