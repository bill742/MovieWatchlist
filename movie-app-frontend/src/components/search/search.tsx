"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const [term, setTerm] = useState("");
  const [movies, setMovies] = useState([]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/search?term=${term}`);
    setTerm("");
  };

  const clearSearch = () => {
    setTerm("");
  };

  return (
    <div className="w-60% flex p-4">
      <form id="searchForm" onSubmit={handleSubmit}>
        {/* <HStack width={'100%'} columnGap={'1rem'}> */}
        <div className="flex w-full gap-4">
          <Input
            placeholder="Search by Movie Title"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            // variant="outline"
            // htmlSize={4}
            // width="auto"
            // flexGrow={1}
          />
          {term && <X onClick={clearSearch} className="reset" />}
          <Button type="submit" className="submitButton">
            <SearchIcon />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Search;
