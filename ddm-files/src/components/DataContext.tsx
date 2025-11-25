import { createContext, useContext } from "react";
import { inspPageDataTypes } from "./DataProvider";

interface DataContextInterface {
  data: inspPageDataTypes | string;
}

const DataContext = createContext<DataContextInterface | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

export default DataContext;