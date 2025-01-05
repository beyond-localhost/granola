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
import { Route as bowlsRoute } from "../route";

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
          <Link from={bowlsRoute.fullPath} to="/">
            Add the category
            <Plus />
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] font-medium">Title</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bowls.map((bowl) => {
          return (
            <TableRow key={bowl.id}>
              <TableCell>{bowl.name}</TableCell>
              <TableCell>{bowl.description}</TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell className="text-right" colSpan={2}>
            <Link from={bowlsRoute.fullPath} to="/">
              Add the category
            </Link>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
