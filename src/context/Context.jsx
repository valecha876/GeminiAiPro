import { useState } from "react";

import { createContext } from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const finalPrompt = prompt ?? input;

    if (finalPrompt.trim() !== "" && !prevPrompts.includes(finalPrompt)) {
      setPrevPrompts((prev) => [...prev, finalPrompt]);
    }
    setRecentPrompt(finalPrompt);
    let response = await main(finalPrompt);

    // setRecentPrompt(prompt)
    // setPrevPrompts(prev=>[...prev,input])
    // const response = await main(prompt);
    // console.log("AI Response:", response);
    let responseArray = response.split("*");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i == 0 || i % 2 == 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("#").join("<br/>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };
  // onSent("what is react js");
  // Function to handle sending the prompt to the AI model
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
