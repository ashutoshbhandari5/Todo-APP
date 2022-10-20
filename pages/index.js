import React, { useEffect, useState } from "react";
import Editor from "../components/Editor/Editor";

export default function Home() {
  const [listContainer, setListContainer] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const getInitialList = () => {
    if (typeof window !== undefined && typeof localStorage !== undefined) {
      const initialList = JSON.parse(localStorage.getItem("listContainer"));
      if (initialList) {
        return initialList;
      }
      return [];
    }
  };

  const setListContainerInLocalStorage = (listContainer) => {
    if (window !== undefined) {
      if (listContainer !== null) {
        localStorage.setItem("listContainer", JSON.stringify(listContainer));
      } else {
        localStorage.setItem("listContainer", JSON.stringify([]));
      }
    }
  };

  const handleUpdateList = (item) => {
    setListContainer((prevState) => {
      let foundItem = prevState.find((el) => el.id === item.id);
      foundItem = { ...foundItem, ...item };
      const newList = prevState.map((el) => {
        if (el.id === item.id) {
          return foundItem;
        } else {
          return el;
        }
      });
      return [...newList];
    });
  };

  const handleDeleteList = (id) => {
    setListContainer((prevState) => {
      const newArray = prevState.filter((el) => el.id !== id);
      return [...newArray];
    });
  };

  useEffect(() => {
    if (firstRender) {
      setListContainer(getInitialList());
      setFirstRender((prevState) => !prevState);
    } else {
      setListContainerInLocalStorage(listContainer);
    }
  }, [listContainer]);

  return (
    <div className="p-6 relative bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen w-screen flex justify-center place-items-start">
      <h1 className="absolute left-2 top-1 text-2xl text-white font-mono">
        List Editor
      </h1>
      <div className="mt-6 w-full">
        <Editor
          handleDeleteList={handleDeleteList}
          listContainer={listContainer}
          setListContainer={setListContainer}
          handleUpdateList={handleUpdateList}
        />
      </div>
    </div>
  );
}
