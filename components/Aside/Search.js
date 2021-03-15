import Card, { CardTitle } from "components/Card";
import SearchBar from "components/SearchBar";
import React from "react";

export default function Search() {
  return (
    <Card>
      <CardTitle>搜尋文章</CardTitle>
      <SearchBar />
    </Card>
  );
}
