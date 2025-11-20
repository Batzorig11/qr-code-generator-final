"use client";

import { useState, useRef } from "react";
import QrScanner from "qr-scanner";
import Link from "next/link";

export default function Decode() {
  const [decodedResult, setDecodedResult] = useState("");
  const [decodeError, setDecodeError] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setDecodedResult("");
    setDecodeError("");

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      setDecodedResult(result.data);
    } catch (err) {
      console.error("QR scan error:", err);
      setDecodedResult("");
      setDecodeError("No QR code found in this image.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0b0d] text-gray-200 flex flex-col items-center px-10 py-5 gap-10">
      <div className="flex gap-10">
        <Link
          href="/"
          className="text-grey-100 hover:text-blue-300 text-2xl mb-2 inline-block"
        >
          Generate QR
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Decode QR</h1>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT PANEL */}
        <div className="bg-[#111113] p-6 rounded-2xl border border-[#1c1c1e] shadow-lg space-y-4">
          <h2 className="text-xl font-semibold tracking-wide text-gray-300">
            Input Details
          </h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Upload QR Code Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                ref={fileInputRef}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-[#1a1a1d] hover:bg-[#2a2a2e] border border-[#2a2a2e] rounded-lg px-4 py-2 text-sm font-medium text-gray-200 transition-colors"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-400">
                {preview ? "File selected" : "No file chosen"}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-wide text-gray-300">
              Preview
            </h2>
            <div className="bg-[#0d0d0f] border border-[#2a2a2e] rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {preview ? (
                <img
                  src={preview}
                  alt="QR Code Preview"
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <p>No image selected</p>
                  <p className="text-sm mt-1">
                    Upload a QR code image to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-[#111113] p-6 rounded-2xl border border-[#1c1c1e] shadow-lg space-y-8">
          <h2 className="text-xl font-semibold tracking-wide text-gray-300">
            Decoded Content
          </h2>
          <div className="bg-[#0d0d0f] w-full border border-[#2a2a2e] rounded-lg p-4 min-h-fit relative">
            {decodedResult ? (
              <div className="break-all">
                <div className="text-sm w-full text-gray-400 mb-1">
                  Decoded text:
                </div>
                <div className="w-full mb-3 p-3 bg-[#1a1a1d] rounded max-h-[200px] overflow-y-auto">
                  {decodedResult}
                </div>
              </div>
            ) : decodeError ? (
              <div className="text-red-400 text-center h-full flex items-center justify-center">
                {decodeError}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-gray-500">
                  Decoded content will appear here
                </div>
              </div>
            )}
          </div>
          {decodedResult && (
            <div className="pt-4 border-t border-[#2a2a2e]">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(decodedResult);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
