import React, { FC, useCallback, useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { ITEMS_PER_PAGE_PREFERENCE } from "utils/constants";
import useTypographyStyles from "hooks/useTypographyStyles";
import clsx from "clsx";
import { usePageContent } from "customProviders/LocationProvider";
import { useFetchModel } from "hooks/useFetchModel";
import memoize from "utils/memoize";
import useParams from "hooks/useParams";
import { useEnv } from "hooks/useEnv";
import yn from "yn";
import { processEnvServer as isServer } from "hooks/useSsrHooks";
import RHArrowIcon from "icons/RHArrowIcon";
import { getPGDefaultItemsPerPage } from "@RHCommerceDev/utils/getPGDefaultItemsPerPage";
import { useSetSipId } from "@RHCommerceDev/hooks/atoms/useSIPID";
import { TailwindTypography as Typography } from "@RHCommerceDev/component-tailwind-typography";

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
  const { pageContent } = !isAemPage
    ? usePageContent()
    : useFetchModel("/admin/products", false, false);
  const ItemsPerPageOptions = JSON.parse(
    pageContent?.items_per_page_options || "[]"
  )?.filter(item =>
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
    event => {
      const nrpp = event.target.value;
      const searchParams = new URLSearchParams(search);
      const currentPage = Math.floor(+params.no / +params.maxnrpp);
      const newNrpp = nrpp === "load-all" ? totalNumRecs : +nrpp;
      const newMaxPage = Math.floor(totalNumRecs / newNrpp);
      const newPage = Math.min(currentPage, newMaxPage);
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
        localStorage.setItem(ITEMS_PER_PAGE_PREFERENCE, nrpp);
        searchParams.set("maxnrpp", nrpp);
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
    [search, history]
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
          {pageContent?.items_per_page}
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
              !ItemsPerPageOptions.includes(+params.maxnrpp) ||
              params?.loadAll === "true"
                ? "load-all"
                : recsPerPage
            }
            open={selectOpen}
            onClose={() => setSelectOpen(false)}
            onOpen={() => setSelectOpen(true)}
            onChange={e => changeRecsPerPage(e)}
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
              <MenuItem className="!text-[14px]" value={item}>
                {item}
              </MenuItem>
            ))}

            <MenuItem className="!text-[14px]" value={"load-all"}>
              {pageContent?.LOAD_ALL}
            </MenuItem>
          </Select>
        </Typography>
      </div>
    </div>
  );
};

export default memoize(ItemsPerPage);
