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
  useEffect(() => {
    if (qr) {
      const qrData = getQRData();
      qr.update({
        data: qrData,
        width: size,
        height: size,
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
  }, [qr, color, bgColor, dotStyle, cornerStyle, image, getQRData]);

  const generateQR = () => {
    if (qr) {
      const qrData = getQRData();
      qr.update({
        data: qrData,
      });
    }
  };

  function download() {
    if (!qr) return;

    // Temporarily resize to slider value for download
    const downloadSize = size || 200;

    qr.update({
      width: downloadSize,
      height: downloadSize,
    });

    qr.download({ extension: fileType });

    // Restore preview size to 200px
    qr.update({
      width: 200,
      height: 200,
    });
  }

  return (
    <div className="p-4 w-full h-screen flex flex-col text-[18px] justify-start items-center gap-10">
      <div className="flex gap-10 ">
        <div className="border p-4 rounded-md overflow-auto max-h-[90vh] flex-col justify-start items-center flex gap-10 ">
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-md p-1 max-h-fit"
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
            {(type === "url" || type === "text") && (
              <input
                className="border px-2 rounded-md"
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
                  className="border px-2 rounded-md"
                  placeholder="SSID"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                />
                <input
                  className="border px-2 rounded-md"
                  placeholder="Password"
                  value={wifi.password}
                  onChange={(e) =>
                    setWifi({ ...wifi, password: e.target.value })
                  }
                />
                <select
                  className="border rounded-md p-1"
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
                className="rounded-md border px-2"
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
                  className="rounded-md border px-2"
                  placeholder="Phone number"
                />
                <input
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="rounded-md border px-2"
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
                  className="border rounded-md px-2"
                />
                <input
                  placeholder="Subject"
                  onChange={(e) => setEmailSubj(e.target.value)}
                  value={emailSubj}
                  className="border rounded-md px-2"
                />
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Body"
                  className="border rounded-md px-2"
                />
              </div>
            )}
            {type === "geo" && (
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Latitude"
                  value={geoLat}
                  onChange={(e) => setGeoLat(e.target.value)}
                  className="border rounded-md px-2"
                />
                <input
                  placeholder="Longitude"
                  value={geoLng}
                  onChange={(e) => setGeoLng(e.target.value)}
                  className="border rounded-md px-2"
                />
              </div>
            )}
            {type === "vcard" && (
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Full Name"
                  value={vcardName}
                  onChange={(e) => setvcardName(e.target.value)}
                  className="border rounded-md px-2"
                />
                <input
                  placeholder="Phone"
                  value={vcardPhone}
                  onChange={(e) => setvcardPhone(e.target.value)}
                  className="border rounded-md px-2"
                />
                <input
                  placeholder="Email"
                  value={vcardEmail}
                  onChange={(e) => setvcardEmail(e.target.value)}
                  className="border rounded-md px-2"
                />
              </div>
            )}
            {type === "bitcoin" && (
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Address"
                  value={bitAddress}
                  onChange={(e) => setBitAddress(e.target.value)}
                  className="border rounded-md px-2"
                />
                <input
                  placeholder="Amount"
                  value={bitAmount}
                  onChange={(e) => setBitAmount(e.target.value)}
                  className="border rounded-md px-2"
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
                  className="border rounded-md px-2"
                />
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2">
                    <label>Start Date</label>
                    <input
                      value={calStart}
                      onChange={(e) => setCalStart(e.target.value)}
                      type="date"
                      className="border rounded-md px-2"
                    />
                    <input
                      type="time"
                      onChange={(e) => setCalTimeStart(e.target.value)}
                      value={calTimeStart}
                      className="border rounded-md px-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>End Date</label>
                    <input
                      value={calEnd}
                      onChange={(e) => setCalEnd(e.target.value)}
                      type="date"
                      className="border rounded-md px-2"
                    />
                    <input
                      type="time"
                      value={calTimeEnd}
                      onChange={(e) => setCalTimeEnd(e.target.value)}
                      className="border rounded-md px-2"
                    />
                  </div>
                </div>
                <input
                  className="border rounded-md px-2"
                  placeholder="Description"
                  value={calDesc}
                  onChange={(e) => setCalDesc(e.target.value)}
                />
                <input
                  className="border rounded-md px-2"
                  placeholder="Location"
                  value={calLoc}
                  onChange={(e) => setCalLoc(e.target.value)}
                />
                <div className="flex gap-2"></div>
              </div>
            )}
            <button
              className="max-h-fit border rounded-md px-4 hover:bg-gray-200"
              onClick={() => generateQR()}
            >
              Generate
            </button>
          </div>
          <div className="w-full space-y-4">
            {/* Color Customization */}
            <div className="space-y-2">
              <h3 className="font-medium">Colors</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="">Dots:</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-18 h-8 rounded border border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="">Background:</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-18 h-8 rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Dot Style */}
            <div className="space-y-2">
              <h3 className="font-medium">Dot Style</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "Dots",
                  "Rounded",
                  "Classy",
                  "Classy Rounded",
                  "Square",
                  "Extra Rounded",
                ].map((style) => {
                  const styleValue = style.toLowerCase().replace(" ", "-");
                  return (
                    <button
                      key={styleValue}
                      onClick={() => setDotStyle(styleValue)}
                      className={` p-2 border rounded ${
                        dotStyle === styleValue
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Corner Style */}
            <div className="space-y-2">
              <h3 className="font-medium">Corner Style</h3>
              <div className="flex gap-2">
                {["Square", "Dot", "Rounded"].map((style) => {
                  const styleValue = style.toLowerCase().replace(" ", "-");
                  return (
                    <button
                      key={styleValue}
                      onClick={() => setCornerStyle(styleValue)}
                      className={`flex-1  p-2 border rounded ${
                        cornerStyle === styleValue
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">QR Code Size</h3>
                <span className=" text-gray-600">{size}px</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <h3 className="font-medium">Add Logo</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                  }
                }}
                className="border rounded-md px-2 text-md"
              />
              {image && (
                <div className="flex items-center gap-2  text-green-600">
                  <span>✓ Logo added</span>
                  <button onClick={() => setImage(null)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border p-4 rounded-md flex flex-col gap-4 items-center justify-center">
          <div
            className="min-w-[300px] min-h-[300px] p-4 border rounded-md flex justify-center items-center"
            ref={ref}
          ></div>
          <div className="flex gap-2">
            <button
              className="rounded-md w-full border px-2 hover:bg-gray-200"
              onClick={() => download()}
            >
              Download
            </button>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="border w-fit rounded p-1 text-md"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
