import { useEffect, useReducer } from "react";
import axios from "axios";

import { skillReducer, initialState } from "../reducers/skillReducer";

import { requestStates } from "../constants";

import { LanguageState } from "../reducers/skillReducer";

type Language = {
  state: string[];
  dispatch?: string;
  language: string;
};

export type UseSkills = [
  sortedLanguageList: () => LanguageState[] | undefined,
  fetchRequestState: string | undefined,
  converseCountToPercentage: (languageCount: number) => number
];
const LANGUAGE_COUNT_BASE = 10;

export function useSkills(): UseSkills {
  // stateはlanguageListとrequestStateを初期化している
  // dispatchはaction
  // initialStateは初期ステート
  const [state, dispatch] = useReducer(skillReducer, initialState);

  const fetchApi = () => {
    axios
      .get<Language[]>("https://api.github.com/users/FujieMasaki/repos")
      .then((response) => {
        const languageList: string[] = response.data.map((res) => res.language);
        // ['JavaScript', 'JavaScript', 'Ruby', null]な、かたちで返される
        const countedLanguageList = generateLanguageCountObj(languageList);
        dispatch({
          type: "actionTypes.success",
          payload: { languageList: countedLanguageList },
        });
      })
      .catch(() => {
        dispatch({ type: "actionTypes.error" });
      });
  };

  useEffect(() => {
    if (state.requestState !== requestStates.loading)
      return () => {
        fetchApi();
      };
  }, [state.requestState]);

  useEffect(() => {
    dispatch({ type: "actionTypes.fetch" });
  }, []);

  const generateLanguageCountObj = (allLanguageList: string[]) => {
    const notNullLanguageList = allLanguageList.filter(
      (language: string) => language != null
    );
    const uniqueLanguageList = [...new Set(notNullLanguageList)];
    // 重複値をとりにぞいた新たな配列を生成する。['JavaScript', 'JavaScript', 'Ruby']を['JavaScript','Ruby']にする
    return uniqueLanguageList.map((item) => {
      return {
        language: item,
        count: allLanguageList.filter((language) => language === item).length,
      };
    });
  };

  // const notNullLanguageList = (allLanguageList: string[]) => {
  //   allLanguageList.filter((language: string) => language != null);
  // };

  const converseCountToPercentage = (languageCount: number): number => {
    if (languageCount > 0) {
      return Math.round((languageCount / 28) * 100);
    }

    return LANGUAGE_COUNT_BASE;
  };

  const sortedLanguageList = () =>
    state.languageList?.sort(
      (firstLang, nextLang) => nextLang.count - firstLang.count
    );
  // state.languageListには{language: 'TypeScript', count: 8},{language: 'Ruby', count: 5} が入ってくる
  // countが多い、降順にならべられる。

  return [sortedLanguageList, state.requestState, converseCountToPercentage];
}

// const converseCountToPercentage = (languageCount: number): number => {
//   if (languageCount > LANGUAGE_COUNT_BASE) {
//     return DEFAULT_MAX_PERCENTAGE;
//   }
//   return languageCount * LANGUAGE_COUNT_BASE;
// };
