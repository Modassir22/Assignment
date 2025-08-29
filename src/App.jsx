import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";

// Context for theme + session
const AppContext = createContext();
export function useAppContext() {
  return useContext(AppContext);
}

function App() {
  const [dropDown, setDropDown] = useState(false);
  const [text, setText] = useState("");
  const [menu, setMenu] = useState(true);
  const [theme, setTheme] = useState("light");

  
  const [models, setModels] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.querySelector(".fa-bars").style.color = "#fff";
      document.querySelector("#main").style.backgroundColor = "#27272a";
      document.querySelector("#login").style.backgroundColor = "#ffffff";
      document.querySelector("#login").style.color = "#000";
    } else {
      document.querySelector(".fa-bars").style.color = "#000";
      document.querySelector("#main").style.backgroundColor = "#ffffff";
      document.querySelector("#login").style.color = "#fff";
      document.querySelector("#login").style.backgroundColor = "#27272a";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      
      const defaultModels = [
        { id: "default", name: "Default Model", description: "Fallback model" }
      ];
      const defaultTemplates = [
        { id: "default", name: "Default Template", content: "Default content" }
      ];

      try {
        const resModels = await fetch("/models.json");
        const resTemplates = await fetch("/templates.json");

        if (resModels.ok && resModels.headers.get('content-type')?.includes('application/json')) {
          const modelsData = await resModels.json();
          setModels(modelsData);
        } else {
          console.warn('Models.json not found, using default data');
          setModels(defaultModels);
        }

        if (resTemplates.ok && resTemplates.headers.get('content-type')?.includes('application/json')) {
          const templatesData = await resTemplates.json();
          setTemplates(templatesData);
        } else {
          console.warn('Templates.json not found, using default data');
          setTemplates(defaultTemplates);
        }

      } catch (fetchError) {
        console.warn('Fetch failed, using default data:', fetchError);
        setModels(defaultModels);
        setTemplates(defaultTemplates);
      }
      
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


  const handleDropDown = () => setDropDown(!dropDown);
  const handleSidebar = () => setMenu(!menu);
  const handleChat = () => setText("");

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      <div id="main" className="w-screen h-screen bg-zinc-800 flex">
        {menu ? (
          <div className="bg-zinc-600 w-full hidden h-full Z-1 lg:block lg:w-[20%]">
            <div className="w-full flex items-center justify-between p-5">
              <i className="text-white text-xl fa-brands fa-openai"></i>
              <i
                onClick={handleSidebar}
                className="text-white fa-solid fa-bars"
              ></i>
            </div>

            <div className="text-white ml-5 mt-5 hover:bg-zinc-500 w-48 p-1 rounded-md">
              <button onClick={handleChat}>
                New Chat <span><i className="fa-solid fa-pen-to-square"></i></span>
              </button>
            </div>

            <div className="text-white ml-5 mt-10 p-1">
              <h3 className="font-bold">Chats</h3>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && (
                <>
                  <p className="mt-2 font-semibold">Models:</p>
                  <ul className="ml-4 list-disc">
                    {models.map((m) => (
                      <li key={m.id}>{m.text}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold">Templates:</p>
                  <ul className="ml-4 list-disc">
                    {templates.map((t) => (
                      <li key={t.id}>{t.name}: {t.text}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : null}

        {!menu ? (
          <i
            onClick={handleSidebar}
            className="mt-8 fa-bar text-black ml-5 fa-solid fa-bars"
          ></i>
        ) : null}

        <div className="flex-1 relative h-full p-5">
          <nav className="w-full flex items-center justify-between">
            <div className=" relative rounded-md text-white text-lg ml-5">
              <button
                onClick={handleDropDown}
                className="flex h-9 w-26 rounded-md p-2 items-center bg-zinc-700 justify-between"
              >
                <div>ChatGpt</div>
                <i className="fa-solid fa-angle-down p-2"></i>
              </button>
              {dropDown ? (
                <div className="h-18 w-44 rounded-md absolute left-[1%] top-[110%] bg-zinc-700">
                  <p className="p-1 rounded-md m-2 hover:bg-zinc-500">
                    Claude AI
                  </p>
                  <hr style={{ color: "green" }} />
                  <p className="p-1 rounded-md m-2 hover:bg-zinc-500">
                    Custom API
                  </p>
                </div>
              ) : null}
            </div>
            <div>
              <button id="login" className="mr-3 text-black  w-20 h-9 rounded">
                Login
              </button>
              <button className="mr-5 bg-zinc-500 text-white w-20 h-9 rounded">
                Sign Up
              </button>
              <button onClick={toggleTheme}>
                {theme === "dark" ? (
                  <i className="fa-solid fa-moon text-white"></i>
                ) : (
                  <i className="fa-solid fa-sun text-black"></i>
                )}
              </button>
            </div>
          </nav>

          
          <div className="w-[70%] h-[8%] flex items-center justify-between p-5 rounded-full text-center left-[15%] absolute bottom-[10%] bg-zinc-700">
            <i className="sticky text-white fa-solid fa-plus"></i>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask Anything"
              className="text-white pt-5 w-[90%] h-auto bg-transparent outline-none resize-none border-none leading-tight"
            ></textarea>
            <button className="w-[30px] sticky rounded-full flex items-center justify-center h-[30px] bg-zinc-600">
              <i className="text-white fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
