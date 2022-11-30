import React, { useEffect, useState } from "react";
import "./App.css";
import { storage } from "./Firebase";
import {
  ref,
  getDownloadURL,
  getMetadata,
  listAll,
  list,
} from "firebase/storage";

const storageRef = ref(storage);

function App() {
  const [data, setData] = useState([]);
  const [foulderItems, setFoulderItems] = useState([]);
  useEffect(() => {
    /* console.log(storageRef); */
    //get download url
    /* getDownloadURL(ref(storage, "Fantacy.pdf"))
      .then((url) => {
        console.log(url);
      })
      .catch((err) => {
        console.log("error: " + err);
      }); */
    //get metadata
    /* getMetadata(storageRef).then((metadata) => {
      console.log(metadata);
    }); */
    //get all foulders and items
    /* listAll(storageRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        console.log(folderRef.fullPath);
      });
      res.items.forEach((item) => {
        console.log(item);
      });
    }); */
    GetAllFoulders();
  }, []);

  const GetAllFoulders = async () => {
    const firstPage = await list(storageRef, { maxResults: 100 });
    let itemArr = [];
    firstPage.prefixes.forEach((item) => {
      const getFullPath = item.fullPath;
      itemArr.push(getFullPath);
    });
    setData(itemArr);

    /* if (firstPage.nextPageToken) {
      const secoundPage = await list(storageRef, {
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      });
      console.log("secoundPage: " + secoundPage.prefixes);
    } */
  };

  const GetURLForPdf = (path) => {
    GetAllItemsInFoulder(path).then((items) => setFoulderItems(items));
  };

  const GetAllItemsInFoulder = async (path) => {
    const foulderPath = ref(storage, path);
    const firstPage = await list(foulderPath, { maxResults: 100 });

    const items = firstPage.items.map((item) =>
      getDownloadURL(ref(foulderPath, item.name))
    );
    const foo = await Promise.all(items);

    return foo;
  };

  return (
    <>
      <div className='App'>
        {data.map((item) => {
          return (
            <button key={item} onClick={() => GetURLForPdf(item)}>
              {item}
            </button>
          );
        })}

        {foulderItems.map((item) => {
          return <iframe key={item} src={item} title='item'></iframe>;
        })}
      </div>
    </>
  );
}

export default App;
