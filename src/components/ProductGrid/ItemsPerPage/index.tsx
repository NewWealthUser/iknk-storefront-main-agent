import React, { FC, useCallback, useEffect, useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
// Placeholder imports
const useHistory = () => ({ replace: (obj: any) => {} });
const useLocation = () => ({ pathname: "", search: "" });
const ITEMS_PER_PAGE_PREFERENCE = "itemsPerPage";
const useTypographyStyles = (props: any) => ({ rhBaseCaption: "", rhBaseBody1: "", rhBaseBody2: "" });
import clsx from "clsx";
const usePageContent = () => ({ pageContent: { items_per_page_options: "[]", items_per_page: "Items Per Page", LOAD_ALL: "Load All" } });
const useFetchModel = (url: string, arg1: boolean, arg2: boolean) => ({ pageContent: { NEW: "New", STARTING_AT: "Starting At", items_per_page_options: "[]", items_per_page: "Items Per Page", LOAD_ALL: "Load All" } });
const useParams = (props: any) => ({ no: "0", maxnrpp: "24", loadAll: "" });
const useEnv = () => ({ FEATURE_PG_DEFAULT_ITEMS_PER_PAGE: "false" });
const yn = (value: any) => value === "true";
const isServer = false;
const RHArrowIcon = (props: any) => <svg {...props} />;
const getPGDefaultItemsPerPage = () => 24;
const useSetSipId = () => (id: any) => {}; // Added semicolon here
const Typography = (props: any) => <div className={props.className}>{props.children}</div>;

export interface ItemsPerPageProps {
  recsPerPage: number;
  lastRecNum: number;
  totalNumRecs: number;
  loadMoreData: (resultCount: number, no?: number) => void;
}

const ItemsPerPage: FC<ItemsPerPageProps> = ({
  recsPerPage,
  lastRecNum,
  totalNumRecs,
  loadMoreData
}) => {
  const env = useEnv();
  const setSipId = useSetSipId();
  const FEATURE_PG_DEFAULT_ITEMS_PER_PAGE = yn(
    env.FEATURE_PG_DEFAULT_ITEMS_PER_PAGE
  );
  const PG_DEFAULT_ITEMS_PER_PAGE = getPGDefaultItemsPerPage();
  const [selectOpen, setSelectOpen] = useState(false);
  const { pathname, search } = useLocation();
  const isAemPage = !pathname?.includes(".jsp");
  const { items_per_page_options, items_per_page, LOAD_ALL } = !isAemPage
    ? (usePageContent() as { items_per_page_options: string; items_per_page: string; LOAD_ALL: string })
    : (useFetchModel("/admin/products", false, false) as { items_per_page_options: string; items_per_page: string; LOAD_ALL: string });
  const ItemsPerPageOptions = JSON.parse(
    items_per_page_options || "[]"
  )?.filter((item: number) =>
    FEATURE_PG_DEFAULT_ITEMS_PER_PAGE ? item !== 48 && item !== 24 : item !== 24
  );

  const history = useHistory();

  const storedItemsPerPagePreference = !isServer
    ? localStorage.getItem(ITEMS_PER_PAGE_PREFERENCE)
    : undefined;

  const params = useParams({
    no: "0",
    maxnrpp: storedItemsPerPagePreference ?? String(PG_DEFAULT_ITEMS_PER_PAGE),
    loadAll: ""
  });

  const changeRecsPerPage = useCallback(
    (event: SelectChangeEvent<string | number>) => { // Changed event type here
      const nrpp = event.target.value;
      const searchParams = new URLSearchParams(search);
      const currentPage = Math.floor(Number(params.no) / Number(params.maxnrpp));
      const newNrpp = nrpp === "load-all" ? totalNumRecs : Number(nrpp);
      const newMaxPage = Math.min(currentPage, newMaxPage);
      const newNo = newPage * newNrpp;
      setSipId(null);
      if (nrpp === "load-all") {
        searchParams.set("loadAll", "true");
        searchParams.delete("no");
        searchParams.set("maxnrpp", String(51));
        // loadMoreData(totalNumRecs, 0);
      } else {
        if (yn(searchParams.has("loadAll"))) {
          searchParams.delete("loadAll");
          searchParams.delete("no");
        } else {
          searchParams.set("no", String(newNo));
          // loadMoreData(newNrpp);
        }
        localStorage.setItem(ITEMS_PER_PAGE_PREFERENCE, nrpp as string); // Cast to string
        searchParams.set("maxnrpp", nrpp as string); // Cast to string
      }
      const updatedSearch = searchParams.toString();
      history.replace({
        search: updatedSearch
      });
      const isLoadAll = nrpp === "load-all";
      const target = event.target as HTMLElement;
      const id = (target?.parentNode as HTMLElement)?.id;
      document?.body?.dispatchEvent(
        new CustomEvent("cta_click", {
          detail: {
            item: {
              isPaginationClick: true,
              pageNo: `${nrpp} ${isLoadAll ? "" : "per "}page`,
              pageType: "items per pages click",
              class: target?.className,
              id: target?.id || id
            }
          }
        })
      );
      setTimeout(() => {
        window?.scrollTo(0, 0);
      }, 100);
    },
    [search, history, params.no, params.maxnrpp, setSipId, totalNumRecs]
  );

  const typographyStyles = useTypographyStyles({
    keys: ["rhBaseCaption", "rhBaseBody1", "rhBaseBody2"]
  });

  useEffect(() => {
    const handleScroll = () => {
      if (selectOpen) {
        setSelectOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectOpen]);

  return (
    <div className="flex flex-none items-center justify-center">
      <div className="flex">
        <Typography
          className={clsx([
            typographyStyles.rhBaseBody1,
            "!mr-7 !flex cursor-pointer select-none items-center sm:!mr-1 md:!mr-0",
            "!font-primary-rhlight !text-[11px] !leading-[110%] tracking-[0.04em]"
          ])}
          onClick={() => setSelectOpen(true)}
        >
          {items_per_page}
        </Typography>

        <Typography
          className={clsx([
            typographyStyles.rhBaseBody2,
            "!mr-7 !flex cursor-pointer select-none items-center sm:!mr-1 md:!mr-0",
            "!font-primary-rhlight !text-[11px]"
          ])}
        >
          <Select
            id="itemsPerPage"
            MenuProps={{
              disableScrollLock: true
            }}
            variant="standard"
            value={
              !ItemsPerPageOptions.includes(+Number(params.maxnrpp)) ||
              params?.loadAll === "true"
                ? "load-all"
                : recsPerPage
            }
            open={selectOpen}
            onClose={() => setSelectOpen(false)}
            onOpen={() => setSelectOpen(true)}
            onChange={changeRecsPerPage}
            className="ml-[8px] !bg-transparent !px-0 !pb-0 "
            inputProps={{
              className: `!font-primary-rhlight !text-[11px] !pt-[6px] !pr-[2px] !pb-[4px] !pl-0 focus:!bg-transparent`
            }}
            IconComponent={() => (
              <RHArrowIcon
                onClick={() => setSelectOpen(true)}
                className="min-h-4 min-w-4 rotate-90 !cursor-pointer"
              />
            )}
          >
            {ItemsPerPageOptions.map((item: number) => (
              <MenuItem className="!text-[14px]" value={item} key={item}>
                {item}
              </MenuItem>
            ))}

            <MenuItem className="!text-[14px]" value={"load-all"}>
              {LOAD_ALL}
            </MenuItem>
          </Select>
        </Typography>
      </div>
    </div>
  );
};

export default ItemsPerPage;