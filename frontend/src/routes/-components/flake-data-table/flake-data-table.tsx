import { useFlakeContext } from "#/lib/state";

type Props = {
  bowlId: number;
};

function FlakeDataTable({ bowlId }: Props) {
  const flakes = useFlakeContext((state) => {
    const map = state.map;
    const flakes = Array.from(map.values()).filter(
      (flake) => flake.bowlId === bowlId
    );
    return flakes;
  });

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
