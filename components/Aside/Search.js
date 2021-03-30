import React, { memo } from "react";
import Card, { CardTitle } from "components/Card";
import SearchBar from "components/SearchBar";

export default memo(function Search() {
  return (
    <Card>
      <CardTitle as="h3">搜尋文章</CardTitle>
      <SearchBar />
    </Card>
  );
});
