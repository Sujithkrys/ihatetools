"use client";

import { useState } from "react";
import { Download, Loader2, Plus, Trash2, FileSpreadsheet, Eye, Sparkles } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const SAMPLE_INVOICE = {
  businessName: "Acme Creative Studio",
  businessEmail: "billing@acmecreative.com",
  businessAddress: "123 Innovation Way, Suite 400\nSan Francisco, CA 94105",
  businessPhone: "+1 (555) 234-5678",

  clientName: "Global Apex Partners",
  clientEmail: "accounts@globalapex.io",
  clientAddress: "789 Enterprise Blvd, Floor 12\nNew York, NY 10001",

  invoiceNumber: "INV-2026-0042",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  currency: "$",
  taxRate: 8.5,
  notes: "Payment due within 14 days of receipt. Thank you for your business!",

  items: [
    { id: "1", description: "UI/UX System Design & Prototyping", quantity: 1, unitPrice: 2400 },
    { id: "2", description: "Full-stack Web Application Development", quantity: 35, unitPrice: 120 },
    { id: "3", description: "Cloud Infrastructure Setup & CI/CD", quantity: 1, unitPrice: 850 },
  ],
};

export function InvoiceGeneratorWidget() {
  const [businessName, setBusinessName] = useState(SAMPLE_INVOICE.businessName);
  const [businessEmail, setBusinessEmail] = useState(SAMPLE_INVOICE.businessEmail);
  const [businessAddress, setBusinessAddress] = useState(SAMPLE_INVOICE.businessAddress);
  const [businessPhone, setBusinessPhone] = useState(SAMPLE_INVOICE.businessPhone);

  const [clientName, setClientName] = useState(SAMPLE_INVOICE.clientName);
  const [clientEmail, setClientEmail] = useState(SAMPLE_INVOICE.clientEmail);
  const [clientAddress, setClientAddress] = useState(SAMPLE_INVOICE.clientAddress);

  const [invoiceNumber, setInvoiceNumber] = useState(SAMPLE_INVOICE.invoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(SAMPLE_INVOICE.invoiceDate);
  const [dueDate, setDueDate] = useState(SAMPLE_INVOICE.dueDate);
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState<number>(SAMPLE_INVOICE.taxRate);
  const [notes, setNotes] = useState(SAMPLE_INVOICE.notes);

  const [items, setItems] = useState<LineItem[]>(SAMPLE_INVOICE.items);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof LineItem, val: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const loadSampleData = () => {
    setBusinessName(SAMPLE_INVOICE.businessName);
    setBusinessEmail(SAMPLE_INVOICE.businessEmail);
    setBusinessAddress(SAMPLE_INVOICE.businessAddress);
    setBusinessPhone(SAMPLE_INVOICE.businessPhone);
    setClientName(SAMPLE_INVOICE.clientName);
    setClientEmail(SAMPLE_INVOICE.clientEmail);
    setClientAddress(SAMPLE_INVOICE.clientAddress);
    setInvoiceNumber(`INV-${Date.now().toString().slice(-4)}`);
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
    setCurrency("$");
    setTaxRate(SAMPLE_INVOICE.taxRate);
    setNotes(SAMPLE_INVOICE.notes);
    setItems(SAMPLE_INVOICE.items);
  };

  const generateInvoicePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
      const { width, height } = page.getSize();

      const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 40;
      let y = height - margin;

      // Primary theme color
      const primaryColor = rgb(0.12, 0.24, 0.38); // deep navy
      const mutedColor = rgb(0.4, 0.45, 0.5);
      const borderColor = rgb(0.85, 0.87, 0.9);
      const lightBg = rgb(0.96, 0.97, 0.98);

      // Header Banner
      page.drawRectangle({
        x: margin,
        y: y - 40,
        width: width - margin * 2,
        height: 50,
        color: lightBg,
      });

      page.drawText("INVOICE", {
        x: margin + 15,
        y: y - 24,
        size: 24,
        font: fontBold,
        color: primaryColor,
      });

      page.drawText(`# ${invoiceNumber || "INV-001"}`, {
        x: width - margin - 15 - fontBold.widthOfTextAtSize(`# ${invoiceNumber || "INV-001"}`, 14),
        y: y - 20,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });

      y -= 65;

      // Two column metadata: Biller info (left), Client & dates info (right)
      const colWidth = (width - margin * 2 - 20) / 2;

      // From (Business)
      page.drawText("BILLED FROM:", {
        x: margin,
        y,
        size: 9,
        font: fontBold,
        color: mutedColor,
      });
      page.drawText(businessName || "Your Company", {
        x: margin,
        y: y - 16,
        size: 13,
        font: fontBold,
        color: primaryColor,
      });

      let fromY = y - 32;
      if (businessEmail) {
        page.drawText(businessEmail, { x: margin, y: fromY, size: 9, font: fontNormal });
        fromY -= 13;
      }
      if (businessPhone) {
        page.drawText(businessPhone, { x: margin, y: fromY, size: 9, font: fontNormal });
        fromY -= 13;
      }
      businessAddress.split("\n").forEach((line) => {
        if (line.trim()) {
          page.drawText(line.trim(), { x: margin, y: fromY, size: 9, font: fontNormal });
          fromY -= 13;
        }
      });

      // To (Client) & Dates (Right Column)
      const rightX = margin + colWidth + 20;
      page.drawText("BILLED TO:", {
        x: rightX,
        y,
        size: 9,
        font: fontBold,
        color: mutedColor,
      });
      page.drawText(clientName || "Client Name", {
        x: rightX,
        y: y - 16,
        size: 13,
        font: fontBold,
        color: primaryColor,
      });

      let toY = y - 32;
      if (clientEmail) {
        page.drawText(clientEmail, { x: rightX, y: toY, size: 9, font: fontNormal });
        toY -= 13;
      }
      clientAddress.split("\n").forEach((line) => {
        if (line.trim()) {
          page.drawText(line.trim(), { x: rightX, y: toY, size: 9, font: fontNormal });
          toY -= 13;
        }
      });

      // Invoice Date & Due Date Pill
      toY -= 8;
      page.drawText(`Date Issued:  ${invoiceDate}`, {
        x: rightX,
        y: toY,
        size: 9,
        font: fontNormal,
      });
      toY -= 14;
      page.drawText(`Due Date:      ${dueDate}`, {
        x: rightX,
        y: toY,
        size: 9,
        font: fontBold,
      });

      y = Math.min(fromY, toY) - 25;

      // Line items table
      const tableWidth = width - margin * 2;
      const colDesc = tableWidth * 0.52;
      const colQty = tableWidth * 0.14;
      const colPrice = tableWidth * 0.17;

      // Table Header
      page.drawRectangle({
        x: margin,
        y: y - 18,
        width: tableWidth,
        height: 24,
        color: primaryColor,
      });

      page.drawText("Description", { x: margin + 8, y: y - 11, size: 9, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText("Qty", { x: margin + colDesc + 8, y: y - 11, size: 9, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText("Unit Price", { x: margin + colDesc + colQty + 8, y: y - 11, size: 9, font: fontBold, color: rgb(1, 1, 1) });
      page.drawText("Amount", { x: margin + colDesc + colQty + colPrice + 8, y: y - 11, size: 9, font: fontBold, color: rgb(1, 1, 1) });

      y -= 26;

      // Table Rows
      items.forEach((item, idx) => {
        const rowHeight = 22;
        if (idx % 2 === 1) {
          page.drawRectangle({
            x: margin,
            y: y - 14,
            width: tableWidth,
            height: rowHeight,
            color: lightBg,
          });
        }

        // Underline border
        page.drawLine({
          start: { x: margin, y: y - 14 },
          end: { x: margin + tableWidth, y: y - 14 },
          thickness: 0.5,
          color: borderColor,
        });

        const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);

        page.drawText(item.description || "Service / Product", {
          x: margin + 8,
          y: y - 8,
          size: 9,
          font: fontNormal,
        });

        page.drawText(String(item.quantity || 1), {
          x: margin + colDesc + 8,
          y: y - 8,
          size: 9,
          font: fontNormal,
        });

        page.drawText(`${currency}${Number(item.unitPrice || 0).toFixed(2)}`, {
          x: margin + colDesc + colQty + 8,
          y: y - 8,
          size: 9,
          font: fontNormal,
        });

        page.drawText(`${currency}${itemTotal.toFixed(2)}`, {
          x: margin + colDesc + colQty + colPrice + 8,
          y: y - 8,
          size: 9,
          font: fontBold,
        });

        y -= rowHeight;
      });

      y -= 15;

      // Summary on right side
      const summaryBoxWidth = 200;
      const summaryX = width - margin - summaryBoxWidth;

      page.drawText("Subtotal:", { x: summaryX, y, size: 9, font: fontNormal, color: mutedColor });
      const subVal = `${currency}${subtotal.toFixed(2)}`;
      page.drawText(subVal, {
        x: width - margin - fontNormal.widthOfTextAtSize(subVal, 9),
        y,
        size: 9,
        font: fontNormal,
      });

      y -= 16;
      page.drawText(`Tax (${taxRate}%):`, { x: summaryX, y, size: 9, font: fontNormal, color: mutedColor });
      const taxVal = `${currency}${taxAmount.toFixed(2)}`;
      page.drawText(taxVal, {
        x: width - margin - fontNormal.widthOfTextAtSize(taxVal, 9),
        y,
        size: 9,
        font: fontNormal,
      });

      y -= 22;
      page.drawRectangle({
        x: summaryX - 8,
        y: y - 8,
        width: summaryBoxWidth + 8,
        height: 28,
        color: lightBg,
      });

      page.drawText("Total Due:", { x: summaryX, y: y + 2, size: 11, font: fontBold, color: primaryColor });
      const totalVal = `${currency}${grandTotal.toFixed(2)}`;
      page.drawText(totalVal, {
        x: width - margin - fontBold.widthOfTextAtSize(totalVal, 12),
        y: y + 2,
        size: 12,
        font: fontBold,
        color: primaryColor,
      });

      // Notes & Terms (Bottom left)
      if (notes.trim()) {
        const notesY = y + 10;
        page.drawText("NOTES & TERMS:", {
          x: margin,
          y: notesY,
          size: 8,
          font: fontBold,
          color: mutedColor,
        });
        let lineY = notesY - 14;
        notes.split("\n").forEach((nl) => {
          if (nl.trim()) {
            page.drawText(nl.trim(), {
              x: margin,
              y: lineY,
              size: 8,
              font: fontNormal,
              color: mutedColor,
            });
            lineY -= 12;
          }
        });
      }

      // Footer
      page.drawText("Generated with ihatetools.com - 100% Private, Client-Side Invoice Generator", {
        x: margin,
        y: margin - 10,
        size: 7.5,
        font: fontNormal,
        color: mutedColor,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl(newUrl);
    } catch (err) {
      console.error("Failed to build invoice PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[var(--primary)]" />
            Professional Invoice Builder
          </h2>
          <p className="text-xs text-[var(--ink-muted)]">
            Create clean, client-ready PDF invoices locally in your browser.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSampleData}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Fill Demo Data
          </button>
          <button
            onClick={generateInvoicePdf}
            disabled={isGenerating}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Details */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <h3 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--border)] pb-2">
            Your Business Information (Sender)
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                Business / Freelancer Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                Address / City / Country
              </label>
              <textarea
                rows={2}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
              />
            </div>
          </div>
        </div>

        {/* Client Details & Dates */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <h3 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--border)] pb-2">
            Client & Invoice Metadata
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Invoice #
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Client Name / Company
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--ink-muted)] block mb-1">
                Client Address
              </label>
              <textarea
                rows={2}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full text-sm p-2 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="font-bold text-sm text-[var(--ink)]">Line Items</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ink-muted)]">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs p-1 bg-[var(--paper)] border border-[var(--border)] rounded font-semibold text-[var(--ink)]"
            >
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="₹">₹ INR</option>
              <option value="C$">C$ CAD</option>
              <option value="A$">A$ AUD</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap md:flex-nowrap items-center gap-3 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--paper)]"
            >
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Item description or service rendered..."
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="w-full text-sm p-1.5 bg-transparent border-none focus:outline-none text-[var(--ink)]"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-center text-[var(--ink)]"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                  className="w-full text-sm p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded text-right text-[var(--ink)]"
                />
              </div>
              <div className="w-28 text-right font-bold text-sm text-[var(--ink)] pr-2">
                {currency}
                {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="p-1.5 text-[var(--ink-muted)] hover:text-red-500 disabled:opacity-30 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={addItem}
            className="px-3 py-1.5 text-xs font-semibold text-[var(--ink)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Line Item
          </button>

          {/* Totals Breakdown */}
          <div className="w-72 space-y-2 bg-[var(--paper)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>Subtotal:</span>
              <span className="font-semibold text-[var(--ink)]">
                {currency}{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] gap-2">
              <span className="flex items-center gap-1">
                Tax (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-14 p-1 text-xs bg-[var(--surface)] border border-[var(--border)] rounded text-center text-[var(--ink)]"
                />
              </span>
              <span className="font-semibold text-[var(--ink)]">
                {currency}{taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-[var(--border)] pt-2 flex justify-between text-sm font-bold text-[var(--ink)]">
              <span>Grand Total:</span>
              <span className="text-[var(--primary)]">
                {currency}{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes / Terms */}
      <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
        <label className="text-xs font-semibold text-[var(--ink)] block">
          Notes & Payment Instructions (Appears at bottom of invoice)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Wire transfer details, IBAN/SWIFT, or late fee policy..."
          className="w-full text-sm p-2.5 bg-[var(--paper)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)] text-[var(--ink)]"
        />
      </div>

      {/* Output / Preview section */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <p className="font-bold text-[var(--ink)]">Ready to export?</p>
          <p className="text-xs text-[var(--ink-muted)]">
            Generates high-resolution vector PDF with clean layout directly in memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generateInvoicePdf}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            {pdfUrl ? "Update PDF" : "Generate Invoice PDF"}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${invoiceNumber || "invoice"}.pdf`}
              className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          )}
        </div>
      </div>

      {pdfUrl && (
        <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] space-y-2">
          <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
            Live Document Preview
          </p>
          <iframe
            src={pdfUrl}
            className="w-full h-[650px] rounded-lg border border-[var(--border)] bg-white"
            title="Invoice Preview"
          />
        </div>
      )}
    </div>
  );
}
