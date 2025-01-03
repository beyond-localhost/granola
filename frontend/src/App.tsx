import { useEffect, useState } from "react";
import "./App.css";

import * as models from "../wailsjs/go/models";
import * as BowlsService from "../wailsjs/go/bowls/BowelService";

function App() {
  const [bowls, setBowls] = useState<models.bowls.Bowl[]>([]);

  const [pendingName, setPendingName] = useState("");
  const [pendingDescription, setPendingDescription] = useState("");

  const onDeleteBowl = (bowlId: models.bowls.Bowl["id"]) => () => {
    BowlsService.DeleteById(bowlId).then(() => {
      setBowls((bowls) => bowls.filter((bowl) => bowl.id !== bowlId));
    });
  };

  const onCreateBowl = () => {
    if (pendingName === "" || pendingDescription === "") {
      return;
    }
    BowlsService.Create(pendingName, pendingDescription).then((bowl) => {
      setBowls((bowls) => [...bowls, bowl]);
      setPendingName("");
      setPendingDescription("");
    });
  };

  useEffect(() => {
    BowlsService.GetAll().then((bowls) => {
      setBowls(bowls);
    });
  }, []);

  return (
    <div id="App">
      <h1>Bowls</h1>
      <ul>
        {bowls.map((bowl) => (
          <li key={bowl.id}>
            <div>{bowl.name}</div>
            <div>{bowl.description}</div>
            <button onClick={onDeleteBowl(bowl.id)}>delete</button>
          </li>
        ))}
      </ul>
      <form>
        <input
          type="text"
          value={pendingName}
          onChange={(e) => setPendingName(e.target.value)}
        />
        <input
          type="text"
          value={pendingDescription}
          onChange={(e) => setPendingDescription(e.target.value)}
        />
        <button type="button" onClick={onCreateBowl}>
          Create
        </button>
      </form>
    </div>
  );
}

export default App;
