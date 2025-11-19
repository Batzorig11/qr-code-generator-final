"use client";

import Link from "next/link";
import QRCodeStyling from "qr-code-styling";
import { useRef, useEffect, useState, useCallback } from "react";

export default function Home() {
  const ref = useRef(null);
  const [qr, setQr] = useState(null);

  //[color, bgColor, dotStyle, cornerStyle, image, isGenerated]);

  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState("png");
  const [size, setSize] = useState(300);
  const [toggleCustomization, setToggleCustomization] = useState(false);

  const [type, setType] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", type: "WPA" });
  const [tel, setTel] = useState("");

  const [smsNumber, setSmsNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  const [emailTo, setEmailTo] = useState("");
  const [emailSubj, setEmailSubj] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [vcardName, setvcardName] = useState("");
  const [vcardPhone, setvcardPhone] = useState("");
  const [vcardEmail, setvcardEmail] = useState("");

  const [geoLat, setGeoLat] = useState("");
  const [geoLng, setGeoLng] = useState("");

  const [bitAddress, setBitAddress] = useState("");
  const [bitAmount, setBitAmount] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [calTitle, setCalTitle] = useState("");
  const [calDesc, setCalDesc] = useState("");
  const [calLoc, setCalLoc] = useState("");
  const [calStart, setCalStart] = useState(today);
  const [calEnd, setCalEnd] = useState(today);

  const [calTimeStart, setCalTimeStart] = useState("");
  const [calTimeEnd, setCalTimeEnd] = useState("");

  function formatToVCal(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";
    const date = dateStr.replace(/-/g, "");
    const time = timeStr.replace(/:/g, "") + "00"; // add seconds
    return `${date}T${time}`;
  }

  const getQRData = useCallback(() => {
    switch (type) {
      case "url":
        return url.trim() || "https://example.com";
      case "text":
        return text ? `google.com/search?q=${text}` : "";
      case "wifi":
        return `WIFI:T:${wifi.type};S:${wifi.ssid || ""};P:${
          wifi.password || ""
        };;`;
      case "tel":
        return tel ? `TEL:${tel}` : "";
      case "sms":
        return `SMSTO:${smsNumber || ""}:${smsMessage || ""}`;
      case "email":
        return `mailto:${emailTo || ""}?subject=${emailSubj || ""}&body=${
          emailBody || ""
        }`;
      case "vcard": {
        const lines = ["BEGIN:VCARD", "VERSION:3.0"];
        if (vcardName) lines.push(`FN:${vcardName}`);
        if (vcardPhone) lines.push(`TEL:${vcardPhone}`);
        if (vcardEmail) lines.push(`EMAIL:${vcardEmail}`);
        lines.push("END:VCARD");
        return lines.join("\n");
      }
      case "geo":
        return geoLat && geoLng ? `geo:${geoLat},${geoLng}` : "";
      case "bitcoin":
        if (!bitAddress) return "";
        const amountParam = bitAmount
          ? `?amount=${encodeURIComponent(bitAmount)}`
          : "";
        return `bitcoin:${bitAddress}${amountParam}`;
      case "calendar": {
        const start = formatToVCal(calStart, calTimeStart);
        const end = formatToVCal(calEnd, calTimeEnd);

        const lines = [
          "BEGIN:VEVENT",
          `SUMMARY:${calTitle || "Event"}`,
          `DESCRIPTION:${calDesc || ""}`,
          `LOCATION:${calLoc || ""}`,
          `DTSTART:${start || ""}`,
          `DTEND:${end || ""}`,
          "END:VEVENT",
        ];
        return lines.join("\n");
      }
      default:
        return "https://example.com";
    }
  }, [
    type,
    url,
    text,
    wifi,
    tel,
    smsNumber,
    smsMessage,
    emailTo,
    emailSubj,
    emailBody,
    vcardName,
    vcardPhone,
    vcardEmail,
    geoLat,
    geoLng,
    bitAddress,
    bitAmount,
    calTitle,
    calDesc,
    calLoc,
    calStart,
    calEnd,
    calTimeStart,
    calTimeEnd,
  ]);

  useEffect(() => {
    // Initialize QR code with default data
    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      data: "https://example.com",
    });

    setQr(qrCode);
    qrCode.append(ref.current);
  }, []);

  // Update QR code when data or styles change (preview fixed at 200px)
  // useEffect(() => {
  //   if (qr) {
  //     const qrData = getQRData();
  //     qr.update({
  //       data: qrData,
  //       width: size,
  //       height: size,
  //       dotsOptions: {
  //         color,
  //         type: dotStyle,
  //         // Ensure dots and corners have different styles
  //         colorType: { single: true, color: color },
  //       },
  //       cornersSquareOptions: {
  //         type: cornerStyle,
  //         color: color, // You can make this a different color if desired
  //       },
  //       cornersDotOptions: {
  //         type: cornerStyle === "dot" ? "dot" : "square", // Special handling for dot corners
  //         color: color,
  //       },
  //       backgroundOptions: {
  //         color: bgColor,
  //       },
  //       image: image ? URL.createObjectURL(image) : undefined,
  //       imageOptions: {
  //         crossOrigin: "anonymous",
  //         margin: 5,
  //         hideBackgroundDots: true,
  //         imageSize: 0.3, // Logo size (30% of QR code size)
  //       },
  //     });
  //   }
  // }, [qr, color, bgColor, dotStyle, cornerStyle, image, getQRData]);

  const generateQR = () => {
    if (qr) {
      const qrData = getQRData();
      qr.update({
        data: qrData,
        dotsOptions: {
          color,
          type: dotStyle,
          // Ensure dots and corners have different styles
          colorType: { single: true, color: color },
        },
        cornersSquareOptions: {
          type: cornerStyle,
          color: color, // You can make this a different color if desired
        },
        cornersDotOptions: {
          type: cornerStyle === "dot" ? "dot" : "square", // Special handling for dot corners
          color: color,
        },
        backgroundOptions: {
          color: bgColor,
        },
        image: image ? URL.createObjectURL(image) : undefined,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          hideBackgroundDots: true,
          imageSize: 0.3, // Logo size (30% of QR code size)
        },
      });
    }
  };

  function download() {
    if (!qr) return;

    // Temporarily resize to slider value for download
    // const downloadSize = size || 200;

    // qr.update({
    //   width: downloadSize,
    //   height: downloadSize,
    // });

    qr.download({ extension: fileType });

    // Restore preview size to 200px
    // qr.update({
    //   width: 200,
    //   height: 200,
    // });
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0b0d] text-gray-200 flex flex-col items-center p-10 gap-10">
      <h1 className="text-4xl font-bold tracking-tight">QR Code Generator</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT PANEL */}
        <div className="bg-[#111113] p-6 rounded-2xl border border-[#1c1c1e] shadow-lg space-y-8">
          <h2 className="text-xl font-semibold tracking-wide text-gray-300">
            Input Details
          </h2>
          {/* Type Selector */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-[#1a1a1d] border border-[#2a2a2e] rounded-lg p-3 w-full text-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="wifi">Wi-Fi</option>
            <option value="tel">Telephone</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="geo">Geo (lat,lon)</option>
            <option value="vcard">vCard</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="calendar">Calendar/Event</option>
          </select>
          {/* Placeholder for dynamic inputs */}
          {(type === "url" || type === "text") && (
            <input
              className="border border-[#1c1c1e] w-full p-2 rounded-md"
              value={type === "url" ? url : text}
              onChange={(e) =>
                type === "url"
                  ? setUrl(e.target.value)
                  : setText(e.target.value)
              }
              placeholder={type === "url" ? "Enter URL..." : "Enter text..."}
            />
          )}
          {type === "wifi" && (
            <div className="flex flex-col gap-2">
              <input
                className="border border-[#2a2a2e] p-2 w-full rounded-md"
                placeholder="SSID"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              />
              <input
                className="border border-[#2a2a2e] p-2 w-full rounded-md"
                placeholder="Password"
                value={wifi.password}
                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
              />
              <select
                className="bg-[#1a1a1d] border border-[#2a2a2e] rounded-lg p-3 w-full text-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                value={wifi.type}
                onChange={(e) => setWifi({ ...wifi, type: e.target.value })}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          )}
          {type === "tel" && (
            <input
              className="rounded-md border w-full p-2 border-[#2a2a2e]"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="Phone number..."
            />
          )}
          {type === "sms" && (
            <div className="flex flex-col gap-2">
              <input
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                className="rounded-md border p-2 border-[#2a2a2e]"
                placeholder="Phone number"
              />
              <input
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="rounded-md border p-2 border-[#2a2a2e]"
                placeholder="Message"
              />
            </div>
          )}
          {type === "email" && (
            <div className="flex flex-col gap-2">
              <input
                placeholder="To"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <input
                placeholder="Subject"
                onChange={(e) => setEmailSubj(e.target.value)}
                value={emailSubj}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Body"
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
            </div>
          )}
          {type === "geo" && (
            <div className="flex flex-col gap-2">
              <input
                placeholder="Latitude"
                value={geoLat}
                onChange={(e) => setGeoLat(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <input
                placeholder="Longitude"
                value={geoLng}
                onChange={(e) => setGeoLng(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
            </div>
          )}
          {type === "vcard" && (
            <div className="flex flex-col gap-2">
              <input
                placeholder="Full Name"
                value={vcardName}
                onChange={(e) => setvcardName(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <input
                placeholder="Phone"
                value={vcardPhone}
                onChange={(e) => setvcardPhone(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <input
                placeholder="Email"
                value={vcardEmail}
                onChange={(e) => setvcardEmail(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
            </div>
          )}
          {type === "bitcoin" && (
            <div className="flex flex-col gap-2">
              <input
                placeholder="Address"
                value={bitAddress}
                onChange={(e) => setBitAddress(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <input
                placeholder="Amount"
                value={bitAmount}
                onChange={(e) => setBitAmount(e.target.value)}
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
            </div>
          )}
          {type === "calendar" && (
            <div className="flex-col flex gap-2">
              <input
                value={calTitle}
                onChange={(e) => setCalTitle(e.target.value)}
                placeholder="Summary"
                type="text"
                className="border rounded-md p-2 border-[#2a2a2e]"
              />
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-2">
                  <label>Start Date</label>
                  <input
                    value={calStart}
                    onChange={(e) => setCalStart(e.target.value)}
                    type="date"
                    className="border rounded-md p-2 border-[#2a2a2e]"
                  />
                  <input
                    type="time"
                    onChange={(e) => setCalTimeStart(e.target.value)}
                    value={calTimeStart}
                    className="border rounded-md p-2 border-[#2a2a2e]"
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label>End Date</label>
                  <input
                    value={calEnd}
                    onChange={(e) => setCalEnd(e.target.value)}
                    type="date"
                    className="border rounded-md p-2 border-[#2a2a2e]"
                  />
                  <input
                    type="time"
                    value={calTimeEnd}
                    onChange={(e) => setCalTimeEnd(e.target.value)}
                    className="border rounded-md p-2 border-[#2a2a2e]"
                  />
                </div>
              </div>
              <input
                className="border rounded-md p-2 border-[#2a2a2e]"
                placeholder="Description"
                value={calDesc}
                onChange={(e) => setCalDesc(e.target.value)}
              />
              <input
                className="border rounded-md p-2 border-[#2a2a2e]"
                placeholder="Location"
                value={calLoc}
                onChange={(e) => setCalLoc(e.target.value)}
              />
              <div className="flex gap-2"></div>
            </div>
          )}

          {/* Generate */}
          <button
            onClick={generateQR}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold text-white tracking-wide"
          >
            Generate
          </button>
          <div className="flex flex-col gap-2">
            {/* Color Section */}
            <h2 className="text-xl font-semibold tracking-wide text-gray-300">
              Customization{" "}
              <button
                onClick={() => setToggleCustomization(!toggleCustomization)}
                className={`${
                  toggleCustomization ? "rotate-90" : ""
                } transition-all duration-300`}
              >
                »
              </button>
            </h2>
            {toggleCustomization && (
              <div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-300">Colors</h3>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-400">Dots</label>
                      <input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        type="color"
                        className="w-12 h-10 bg-transparent border border-[#2c2c30] rounded"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-400">
                        Background
                      </label>
                      <input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        type="color"
                        className="w-12 h-10 bg-transparent border border-[#2c2c30] rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-300">Dot Style</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {[
                      "Dots",
                      "Rounded",
                      "Classy",
                      "Classy Rounded",
                      "Square",
                      "Extra Rounded",
                    ].map((s) => {
                      const styleValue = s.toLowerCase().replace(" ", "-");
                      return (
                        <button
                          key={styleValue}
                          onClick={() => setDotStyle(styleValue)}
                          className={`bg-[#1a1a1d] border border-[#2d2d30] p-2 rounded-lg hover:bg-[#232326] transition text-gray-300 ${
                            dotStyle === styleValue ? "bg-[#232326]" : ""
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-300">Corner Style</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {["Square", "Dot", "Rounded"].map((s) => {
                      const styleValue = s.toLowerCase().replace(" ", "-");
                      return (
                        <button
                          key={styleValue}
                          onClick={() => setCornerStyle(styleValue)}
                          className={`bg-[#1a1a1d] border border-[#2d2d30] p-2 rounded-lg hover:bg-[#232326] transition text-gray-300 ${
                            cornerStyle === styleValue ? "bg-[#232326]" : ""
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-300">Logo</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(file);
                      }
                    }}
                    className="block w-full text-gray-400 bg-[#1a1a1d] border border-[#2d2d30] rounded-lg p-2 text-sm file:bg-[#232326] file:text-gray-300 file:border-none file:p-3 file:py-1 file:rounded-md hover:file:bg-[#2c2c31]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col max-h-fit sticky top-5 items-center gap-6 bg-[#111113] border border-[#1c1c1e] rounded-2xl shadow-lg p-6">
          <div
            ref={ref}
            className="w-[400px] h-[400px]  bg-white border border-[#2a2a2e] rounded-xl flex items-center justify-center text-gray-500"
          ></div>

          <div className="flex gap-3 w-[260px]">
            <button
              onClick={download}
              className="flex-1 bg-green-600 hover:bg-green-700 transition py-2 rounded-xl font-semibold text-white"
            >
              Download
            </button>

            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="bg-[#1a1a1d] border border-[#2c2c30] rounded-lg p-2 text-gray-300"
            >
              <option>PNG</option>
              <option>JPG</option>
              <option>WEBP</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
