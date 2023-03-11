import { useMemo } from "react";
import { useTable } from "react-table";

export const EpisodeTable = ({ fetchedData }) => {
  const data = useMemo(() => fetchedData);

  const columns = useMemo(
    () => [
      {
        Header: "name",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "air date",
        accessor: "air_date",
      },
      {
        Header: "episode",
        accessor: "episode",
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
            <tr {...row.getRowProps()} key={k}>
              {row.cells.map((cell, l) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "navy",
                    }}
                    key={l}
                  >
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
