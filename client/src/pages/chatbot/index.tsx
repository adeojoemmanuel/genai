import { response } from "express";
import { useState } from "react";
import "react-data-grid/lib/styles.css";

import DataGrid from "react-data-grid";

export default function Test() {
  const [result, setResult] = useState();
  const [question, setQuestion] = useState("");
  const [loadingQuery, setLoadingQuery] = useState(false);

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const responses = {
    count: "Sure, the number is:",
  };

  // Regular expression pattern to match count or number queries
  // We do this to check whether user wants count or table
  const countPattern = /\b(count|quantity|amount|number|how\s+many)\b/i;

  const extractKey =
    /(?:how\s+many|what\s+is\s+the\s+number\s+of|give\s+me\s+the\s+count\s+of)\s+(.*)/i;

  const extractSomething = (query) => {
    const match = query.match(extractKey);
    console.log(match);
    if (match && match[1]) {
      console.log(match, match[1]);
      return match[1];
    }
    return null;
  };

  const handleSendMessage = (message) => {
    // Simple responses to messages
    if (message.toLowerCase() === "hello") {
      setResult("Hi There!, ask me a question regarding your dataset!");
    } else if (message.toLowerCase() === "bye") {
      setResult("See ya!");
    } else if (message.toLowerCase() === "how are you?") {
      setResult("Im doing well thanks");
    }
  };

  // Function to check if the query is asking for count or number
  const isCountQuery = (query) => {
    console.log(query.question);
    return countPattern.test(query.question);
  };

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setLoadingQuery(true);

    const formData = new FormData();

    if (question) {
      formData.append("question", question);
    }

    const isCount = isCountQuery({ question });
    console.log(question, isCount);

    const something = extractSomething(question);
    console.log(something);

    if (question.toLowerCase() === "hello") {
      setResult("Hi There!, ask me a question regarding your dataset!");
      setLoadingQuery(false);
    } else if (question.toLowerCase() === "bye") {
      setResult("See ya!");
      setLoadingQuery(false);
    } else if (/how\s+are\s+you\??/i.test(question)) {
      setResult("Im doing well thanks");
      setLoadingQuery(false);
    } else {
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          let res = JSON.parse(JSON.stringify(data.result));
          res = JSON.parse(res);
          console.log(res);

          if (isCount) {
            setResult(res[0]["COUNT(*)"]);
            setRows([]);
            setColumns([]);
          } else {
            // grid result
            const columnData = Object.keys(res[0]).map((key) => ({
              key: key,
              name: key,
              resizable: true,
              sortable: true,
            }));

            setColumns(columnData);
            setRows(res);
            setResult();

            console.log("Rows", rows);

            // View column data
            console.log("Columns", columnData);

            //setResult(res);
          }

          /*
        let trimmedString = res.replace(/^\[|\]$/g, "");
        console.log(JSON.parse(JSON.stringify(trimmedString)));
        console.log(JSON.parse(trimmedString)["COUNT(*)"]);
        */

          // need one for tables now
          //setResult(JSON.parse(trimmedString)["COUNT(*)"]);

          setLoadingQuery(false);
        })
        .catch((error) => {
          console.error("Error", error);
          setResult("I'm not sure I understand!")
          setLoadingQuery(false);
        });
    }
  };

  return (
    <div className="chatbox_container mx-auto my-8 p-4 bg-gray-400 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="mb-4">
        <label
          className="block mb-2 font-bold text-gray-700"
          htmlFor="question"
        >
          Question:
        </label>
        <input
          className="appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="question"
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={!question}
        >
          Submit
        </button>
      </form>
      {!result && !loadingQuery && (
        <p className="text-gray-700 font-bold">Hello! Ask me a query!</p>
      )}
      {loadingQuery && (
        <p className="text-gray-700 font-bold">Loading response...</p>
      )}
      {result && !loadingQuery && (
        <p className="text-gray-700 font-bold">{result}</p>
      )}
      <div>
        {!loadingQuery && rows.length > 0 && columns.length > 0 && (
          <DataGrid columns={columns} rows={rows} className="rdg-light" />
        )}
      </div>
    </div>
  );
}
