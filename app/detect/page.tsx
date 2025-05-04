/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import axios from "axios";
import { Download, HomeIcon, ImageIcon, Loader } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";

interface InferenceResult {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
}

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  detection_id: string;
}

export default function Page() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // To store the generated image URL
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);

  const elementRef = useRef(null);

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];

    setLoading(true);

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file); // Generate a temporary URL
      setImageUrl(url);

      const loadImageBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const image = await loadImageBase64(file);

      axios({
        method: "POST",
        url: "https://serverless.roboflow.com/horus-perceive/2",
        params: {
          api_key: "VAlnq3JGLDoJAYHhL0vF"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(function (response) {
          setResult(response.data);
          console.log(response.data);

          setLoading(false);
          console.log(result);
        })
        .catch(function (error) {
          console.log(error.message);
          setLoading(false);
        });
    }
  };

  // Function to handle download
  
  const htmlToImageConvert = () => {
    // @ts-ignore
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className=" w-full h-screen ">
      <header className=" w-full border-y-2 py-2">
        <div className=" flex items-center justify-between">
          <div className=" flex items-center ">
            <div className=" pl-10 pr-5 py-2 border-r-2 h-full w-fit">
              <HomeIcon />
            </div>
            <div className=" pl-5">
              <h1 className=" font-semibold text-2xl">Cancer Scanner</h1>
              <p className=" font-medium text-sm text-gray-400">
                Breast-Mi Scanner
              </p>
            </div>
          </div>

          <div className=" pr-5 flex items-center space-x-4">
            <label
              htmlFor="dropzone-files"
              className=" w-fit px-4 flex items-center justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 hover:bg-emerald-500 hover:shadow-xl hover:text-white"
            >
              {loading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader size={24} className="animate-spin" />
                </div>
              ) : (
                <ImageIcon size={24} />
              )}
              <p>Inspect Mri Footage</p>
              <input
                id="dropzone-files"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {/*  <Globe /> */}
            <button
              disabled={file == null && result == null ? true : false}
              onClick={htmlToImageConvert} // Add the download handler
              className=" w-fit flex px-4 py-4 rounded-md disabled:opacity-25 text-center bg-emerald-600 text-white space-x-2"
            >
              <Download />
              <p className=" text-sm">Download Result</p>
            </button>
          </div>
        </div>
      </header>
      <div className=" w-[90%] py-10 space-x-5 mx-auto h-full flex  text-center justify-between ">
        {
          <div className=" w-[70%]">
            {file ? (
              <div className=" w-full h-[60vh] rounded-2xl flex items-center justify-center">
                <div ref={elementRef} className=" relative ">
                  <Image src={`${imageUrl}`} alt="" className=" " width={500} height={500} />
                  {result?.predictions.map((prediction) => {
                    const { x, y, width, height } = prediction;
                    const scaledWidth = (width / result.image.width) * 100; // Scale width to percentage
                    const scaledHeight = (height / result.image.height) * 100; // Scale height to percentage

                    return (
                      <div
                        key={prediction.detection_id}
                        style={{
                          position: "absolute",
                          top: `${(y / result.image.height - 0.1) * 100}% `,
                          left: `${(x / result.image.width - 0.1) * 100}% `,
                          width: `${scaledWidth}%`,
                          height: `${scaledHeight}%`
                        }}
                        className={`  `}
                      >
                        <div
                          className={` bg-black/10 rounded-md ${
                            prediction.class == "Chicken"
                              ? " border-green-500 "
                              : "border-red-500"
                          } border-2 rounded-sm `}
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box"
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: -25,
                              left: 0,
                              padding: "2px 5px"
                            }}
                            className=" text-sm font-semibold  text-red-500"
                          >
                            tumor (
                            {prediction.confidence.toFixed(2)})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-[60vh] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        }

        <div className=" w-[25%] px-5 py-10 h-fit flex flex-col items-center divide-x-2 divide-red-950 rounded-2xl shadow-xl">
          <div className=" w-[90%]">
            <div className=" mt-10">
              <h1 className=" font-semibold text-2xl">Detection Summary</h1>
              <div className=" w-full text-lg mt-5">
                {/* <div className=" font-semibold text-xl text-red-500 flex items-center space-x-2 ">
                  <BsExclamationCircle />
                  <p>Infected Livestock found</p>
                </div> */}

                <div className="  mt-10">
                  {result != null ? (
                    <div className=" grid grid-cols-3 ">
                      {result.predictions.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className=" flex flex-col w-fit  space-y-4 text-lg font-semibold"
                          >
                            <div
                              className={`radial-progress flex flex-col items-center justify-center ${
                                item.class == "Chicken"
                                  ? "bg-green-500 text-green-100 border-green-400"
                                  : "bg-red-500 text-red-100 border-red-400"
                              }  border-4`}
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              style={{ "--value": 70 }}
                              role="progressbar"
                            >
                              {Math.round(item.confidence * 100)}%
                            </div>
                            <p className=" text-xs capitalize">{item.class}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <div className=" flex flex-col w-fit  space-y-4 text-lg font-semibold">
                        <div
                          className="radial-progress bg-primary text-primary-content border-primary border-4"
                          // @ts-ignore
                          style={{ "--value": 0 }}
                          role="progressbar"
                        >
                          0%
                        </div>
                        <p>No Detection</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
