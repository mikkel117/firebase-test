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
  // vi bruger data til at gemme alle filerne
  const [data, setData] = useState([]);
  //vi bruger foulderItems til at gemme de ting i har i filer
  const [foulderItems, setFoulderItems] = useState([]);
  useEffect(() => {
    //hvis i skal bruge metadata så er det den her i skal bruge
    //get metadata
    /* getMetadata(storageRef).then((metadata) => {
      console.log(metadata);
    }); */

    // hvis i ville få alle filer og items så kan i bruge listAll
    //get all foulders and items
    /* listAll(storageRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        console.log(folderRef.fullPath);
      });
      res.items.forEach((item) => {
        console.log(item);
      });
    }); */
    //vi kalder den her første gang siden bilver rendere
    GetAllFoulders();
  }, []);

  //vi bruger async så vi kan await list den kan komme tilbage med max 100 data hvis i ville have med skal i bare ændre det
  const GetAllFoulders = async () => {
    const firstPage = await list(storageRef, { maxResults: 100 });
    let itemArr = [];
    //løber igem prefixes eller mapper så vi kan gemme dem i et array og der efter gemmer vi det i vores setData state
    firstPage.prefixes.forEach((item) => {
      const getFullPath = item.fullPath;
      itemArr.push(getFullPath);
    });
    setData(itemArr);

    //den her har jeg ikke kikket så marget på men den er til hvis i have mere end 1 side
    /* if (firstPage.nextPageToken) {
      const secoundPage = await list(storageRef, {
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      });
      console.log("secoundPage: " + secoundPage.prefixes);
    } */
  };

  //bliver kaldet nå en af mapperne er klikket på
  const GetURLForPdf = (path) => {
    //kalder GetAllItemsInFoulder og tager i mod det data vi får fra vores promise og setter setFoulderItems state til de items
    GetAllItemsInFoulder(path).then((items) => setFoulderItems(items));
  };

  const GetAllItemsInFoulder = async (path) => {
    //laver en rafaranse til folderen der er klikket på
    const foulderPath = ref(storage, path);
    const firstPage = await list(foulderPath, { maxResults: 100 });

    //mapper igem de items eller filder som den kan finde
    const items = firstPage.items.map((item) =>
      //kalder getDownloadURL som tager fat i itemems url
      getDownloadURL(ref(foulderPath, item.name))
    );
    //foo bliver sat til promise.all some venter på at all items er gøret i gemmen og sørger
    //for at vi kan bruge den på den mår vi gør
    const foo = await Promise.all(items);
    //return foo
    return foo;
  };

  return (
    <>
      <div className='App'>
        {/* mapper igemmen data og laver knapper */}
        {data.map((item) => {
          return (
            /* laver en key så react kan holde styr på dem og laver en onclik der der kalder GetURLForPdf med parameterne item */
            <button key={item} onClick={() => GetURLForPdf(item)}>
              {item}
            </button>
          );
        })}
        {/* mapper igem foulderItems og viser dem i en iframe */}
        {foulderItems.map((item) => {
          return <iframe key={item} src={item} title='item'></iframe>;
        })}
      </div>
    </>
  );
}

export default App;
