import { Metadata } from "next";
import { AddPasswordWidget } from "@/components/AddPasswordWidget";

export const metadata: Metadata = {
  title: "Protect PDF - Free Online PDF Encryption | ihatetools",
  description: "Add a password to your PDF file securely with AES-256.",
};

export default function AddPasswordPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <section className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
          Protect PDF
        </h1>
        <p className="text-textSecondary text-lg">
          Add a password to your PDF file securely. Uses AES-256 encryption.
        </p>
      </section>
      <AddPasswordWidget />
    </div>
  );
}
