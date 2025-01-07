// TODO make the data table
import * as React from "react";
import * as model from "@/go/models";

type Props = {
  bowlId: number;
  flakesPromise: Promise<Array<model.flakes.Flake>>;
};

function FlakeDataTable({ bowlId, flakesPromise }: Props) {
  const flakes = React.use(flakesPromise);

  return (
    <ul>
      {flakes.map((f) => (
        <li key={f.id}>
          {f.name} {f.description}
        </li>
      ))}
    </ul>
  );
}

export { FlakeDataTable };
