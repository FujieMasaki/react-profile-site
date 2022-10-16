import React from "react";
import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { count } from "console";

type dataType = {
  name: string;
  full_name: string;
};

type Language = {
  language: string;
  count: number;
  private?: boolean;
};

export const Skills = () => {
  const [languageList, setLanguageList] = useState([]);
  console.log(languageList);
  useEffect(() => {
    axios
      .get("https://api.github.com/users/FujieMasaki/repos")
      .then((response) => {
        const languageList = response.data.map(
          (res: { language: string }) => res.language
        );
        // ['JavaScript', 'JavaScript', 'Ruby', null]な、かたちで返される
        const countedLanguageList =
          generateLanguageCountObj(languageList);
        setLanguageList(countedLanguageList);
      });
  }, []);

  const generateLanguageCountObj = (allLanguageList) => {
    const notNullLanguageList = allLanguageList.filter(
      (language) => language != null
    );
    const uniqueLanguageList = [...new Set(notNullLanguageList)];

    return uniqueLanguageList.map((item) => {
      return {
        language: item,
        count: allLanguageList.filter((language) => language === item).length,
      };
    });
  };

  return (
    <div id="skills">
      <div className="container">
        <div className="heading">
          <h2>Skills</h2>
        </div>
        <div className="skills-container"></div>
      </div>
    </div>
  );
};
