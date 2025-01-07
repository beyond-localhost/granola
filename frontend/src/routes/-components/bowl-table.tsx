import * as React from "react";
import { Link } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import { Button } from "#/components/ui/button";
import { Plus } from "lucide-react";

import { bowls } from "@/go/models";
import { Route as bowlsRoute } from "../bowls.index";
import { Route as bowlAddRoute } from "../bowls_.add";

type Props = {
  bowlsPromise: Promise<Array<bowls.Bowl>>;
};

export function BowlTable({ bowlsPromise }: Props) {
  const bowls = React.use(bowlsPromise);

  if (bowls.length === 0) {
    return (
      <section>
        <p>There is no sections.</p>
        <Button variant="outline" asChild>
          <Link from={bowlsRoute.fullPath} to={bowlAddRoute.to}>
            Add the category
            <Plus />
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <Table>
      <div>
        {bowls.map((bowl) => {
          return (
            <Link to="/bowls/$bowlId" params={{ bowlId: bowl.id.toString() }}>
              <TableCell>{bowl.name}</TableCell>
              <TableCell>{bowl.description}</TableCell>
            </Link>
          );
        })}
        <div>
          <div className="text-right">
            <Link from={bowlsRoute.fullPath} to={bowlAddRoute.to}>
              Add the category
            </Link>
          </div>
        </div>
      </div>
    </Table>
  );
}
