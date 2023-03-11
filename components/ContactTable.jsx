import { useMemo } from "react";
import { useTable } from "react-table";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

export const ContactTable = ({ fetchedData }) => {
  const data = useMemo(() => fetchedData);
  const router = useRouter();
  const handleClickRow = (id) => {
    router.push("/contact/[id]", `/contact/${id}`);
  };

  const columns = useMemo(
    () => [
      {
        Header: "name",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "status",
        accessor: "status",
      },
      {
        Header: "species",
        accessor: "species",
      },
      {
        Header: "gender",
        accessor: "gender",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((column, j) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 3px red",
                  background: "aliceblue",
                  color: "black",
                  fontWeight: "bold",
                }}
                key={j}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, k) => {
          prepareRow(row);

          return (
            <tr
              {...row.getRowProps()}
              onClick={() => handleClickRow(row.original.id)}
              className={styles.tableRow}
              key={k}
            >
              {row.cells.map((cell, l) => {
                return (
                  <td {...cell.getCellProps()} key={l}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
