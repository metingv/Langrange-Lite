/* eslint-disable @next/next/no-img-element */
import {
  useEffect,
  useMemo,
  useState,
  FunctionComponent,
  useCallback,
  SetStateAction,
} from "react";
import { useJupiter, RouteInfo } from "@jup-ag/react-hook";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { PublicKey } from "@solana/web3.js";
import useMangoStore from "../stores/useMangoStore";
import {
  connectionSelector,
  walletConnectedSelector, 
  walletSelector,
} from "../stores/selectors";
import { sortBy, sum } from "lodash";
import { useTranslation } from "next-i18next";
import {
  CogIcon,
  ExclamationCircleIcon,
  ExternalLinkIcon,
  InformationCircleIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import { abbreviateAddress } from "../utils";
import SwapTokenSelect from "./SwapTokenSelect";
import { Token } from "../@types/types";
import {
  getTokenAccountsByOwnerWithWrappedSol,
  nativeToUi,
  TokenAccount,
  zeroKey,
} from "@blockworks-foundation/mango-client";
import Button, { IconButton, LinkButton } from "./Button";
import { useViewport } from "../hooks/useViewport";
import { breakpoints } from "./TradePageGrid";
import useLocalStorageState from "../hooks/useLocalStorageState";
import Modal from "./Modal";
import { ElementTitle } from "./styles";
import { RefreshClockwiseIcon, WalletIcon } from "./icons";
import Tooltip from "./Tooltip";
import SwapSettingsModal from "./SwapSettingsModal";
import SwapTokenInfo from "./SwapTokenInfo";
import { numberFormatter } from "./SwapTokenInfo";
import SwapTokenInsights from "./SwapTokenInsights";

const TrustedTokenAddresses = [
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "A94X2fRy3wydNShU4dRaDyap2UuoeWJGWyATtyp61WZf", // BILIRA
  "5trVBqv1LvHxiSPMsHtEZuf8iN82wbpDcR5Zaw7sWC3s", // soJPYC
  "FtgGSFADXBtroxq8VCausXRr2of47QBf5AS1NtZCu4GD", // BRZ
  "CbNYA9n3927uXUukee2Hf4tm3xxkffJPPZvGazc2EAH1", // agEUR
  "3uXMgtaMRBcyEtEChgiLMdHDjb5Azr17SQWwQo3ppEH8", // Wrapped BRZ
];

type UseJupiterProps = Parameters<typeof useJupiter>[0];

const JupiterForm: FunctionComponent = () => {
  const { t } = useTranslation(["common", "swap"]);
  const wallet = useMangoStore(walletSelector);
  const connection = useMangoStore(connectionSelector);
  const connected = useMangoStore(walletConnectedSelector);

  const [showSettings, setShowSettings] = useState(false);
  const [depositAndFee, setDepositAndFee] = useState(null as any);

  const [selectedRoute, setSelectedRoute] = useState<RouteInfo>(null as any);
  const [showInputTokenSelect, setShowInputTokenSelect] = useState(false);
  const [showOutputTokenSelect, setShowOutputTokenSelect] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenPrices, setTokenPrices] = useState(null);
  const [coinGeckoList, setCoinGeckoList] = useState(null as any);
  const [walletTokens, setWalletTokens] = useState([]);
  const [slippage, setSlippage] = useState(0.5);
  const [formValue, setFormValue] = useState<UseJupiterProps>({
    amount: null as any,
    inputMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    outputMint: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    slippage,
  });
  const [hasSwapped, setHasSwapped] = useLocalStorageState("hasSwapped", false);
  const [showWalletDraw, setShowWalletDraw] = useState(false);
  const [walletTokenPrices, setWalletTokenPrices] = useState(null);
  const { width } = useViewport();
  const isMobile = width ? width < breakpoints.sm : false;
  const [feeValue, setFeeValue] = useState(null as any);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [loadWalletTokens, setLoadWalletTokens] = useState(false);
  const [swapRate, setSwapRate] = useState(false);
  const [activeTab, setActiveTab] = useState("Market Data");

  const handleTabChange = (tabName: SetStateAction<string>) => {
    setActiveTab(tabName);
  };

  const fetchWalletTokens: { (): void; (): Promise<void> } =
    useCallback(async () => {
      const ownedTokens:
        | ((prevState: never[]) => never[])
        | { account: TokenAccount; uiBalance: number }[] = [];
      const ownedTokenAccounts = await getTokenAccountsByOwnerWithWrappedSol(
        connection,
        // @ts-ignore
        wallet.publicKey
      );

      ownedTokenAccounts.forEach((account) => {
        const decimals = tokens.find(
          (t) => t?.address === account.mint.toString()
        )?.decimals;

        const uiBalance = nativeToUi(account.amount, decimals || 6);
        ownedTokens.push({ account, uiBalance });
      });
      console.log("ownedToknes", ownedTokens);
      // @ts-ignore
      setWalletTokens(ownedTokens);
    }, [wallet, connection, tokens]);

  const [inputTokenInfo, outputTokenInfo] = useMemo(() => {
    return [
      tokens.find(
        (item) => item?.address === formValue.inputMint?.toBase58() || ""
      ),
      tokens.find(
        (item) => item?.address === formValue.outputMint?.toBase58() || ""
      ),
    ];
  }, [
    formValue.inputMint?.toBase58(),
    formValue.outputMint?.toBase58(),
    tokens,
  ]);

  useEffect(() => {
    if (width >= 1680) {
      setShowWalletDraw(true);
    }
  }, []);

  useEffect(() => {
    const fetchCoinGeckoList = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      const data = await response.json();
      setCoinGeckoList(data);
    };

    fetchCoinGeckoList();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchWalletTokens();
    }
  }, [connected]);

  useEffect(() => {
    if (!coinGeckoList?.length) return;
    setTokenPrices(null);
    const fetchTokenPrices = async () => {
      const inputId = coinGeckoList.find((x: { id: any; symbol: string }) =>
        inputTokenInfos?.extensions?.coingeckoId
          ? x?.id === inputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === inputTokenInfo?.symbol?.toLowerCase()
      )?.id;

      const outputId = coinGeckoList.find((x: { id: any; symbol: string }) =>
        outputTokenInfos?.extensions?.coingeckoId
          ? x?.id === outputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === outputTokenInfo?.symbol?.toLowerCase()
      )?.id;

      if (inputId && outputId) {
        const results = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${inputId},${outputId}&vs_currencies=usd`
        );
        const json = await results.json();
        if (json[inputId]?.usd && json[outputId]?.usd) {
          setTokenPrices({
            // @ts-ignore
            inputTokenPrice: json[inputId].usd,
            outputTokenPrice: json[outputId].usd,
          });
        }
      }
    };

    if (inputTokenInfo && outputTokenInfo) {
      fetchTokenPrices();
    }
  }, [inputTokenInfo, outputTokenInfo, coinGeckoList]);

  const amountInDecimal = useMemo(() => {
    return formValue.amount * 10 ** (inputTokenInfo?.decimals || 1);
  }, [inputTokenInfo, formValue.amount]);

  const { routeMap, allTokenMints, routes, loading, exchange, error, refresh } =
    useJupiter({
      ...formValue,
      amount: amountInDecimal,
      slippage,
    });

  useEffect(() => {
    // Fetch token list from Jupiter API
    fetch(TOKEN_LIST_URL["mainnet-beta"])
      .then((response) => response.json())
      .then((result) => {
        const tokens = allTokenMints
          .filter((item) => TrustedTokenAddresses.includes(item))
          .map((mint) =>
            result.find((item: { address: string }) => item?.address === mint)
          );
        setTokens(tokens);
      });
  }, [allTokenMints]);

  useEffect(() => {
    if (routes) {
      setSelectedRoute(routes[0]);
    }
  }, [routes]);

  useEffect(() => {
    const getDepositAndFee = async () => {
      const fees: SetStateAction<any> | undefined =
        await selectedRoute.getDepositAndFee();

      setDepositAndFee(fees);
    };
    if (selectedRoute && connected) {
      getDepositAndFee();
    }
  }, [selectedRoute]);

  const outputTokenMints = useMemo(() => {
    if (routeMap.size && formValue.inputMint) {
      const routeOptions: any = routeMap.get(formValue.inputMint.toString());

      const routeOptionTokens = routeOptions.map((address: string) => {
        return tokens.find((t) => {
          return t?.address === address;
        });
      });

      return routeOptionTokens;
    } else {
      return sortedTokenMints;
    }
  }, [routeMap, tokens, formValue.inputMint]);

  const inputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        // @ts-ignore
        return t.account.mint.toString() === inputTokenInfo?.address;
      });

      const largestTokenAccount = sortBy(walletToken, "uiBalance").reverse()[0];
      // @ts-ignore
      return largestTokenAccount?.uiBalance || 0.0;
    }

    return 0.0;
  };

  const outputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        // @ts-ignore
        return t.account.mint.toString() === outputTokenInfo?.address;
      });
      const largestTokenAccount = sortBy(walletToken, "uiBalance").reverse()[0];
      // @ts-ignore
      return largestTokenAccount?.uiBalance || 0.0;
    }
    return 0.0;
  };

  const [walletTokensWithInfos] = useMemo(() => {
    const userTokens: any[] = [];
    tokens.map((item) => {
      const found = walletTokens.find(
        // @ts-ignore
        (token) => token.account.mint.toBase58() === item?.address
      );
      if (found) {
        // @ts-ignore
        userTokens.push({ ...found, item });
      }
    });
    return [userTokens];
  }, [walletTokens, tokens]);

  const getWalletTokenPrices = async () => {
    const ids = walletTokensWithInfos.map(
      (token) => token.item.extensions?.coingeckoId
    );
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.toString()}&vs_currencies=usd`
    );
    const data = await response.json();
    setWalletTokenPrices(data);
  };

  const refreshWallet = async () => {
    setLoadWalletTokens(true);
    await fetchWalletTokens();
    await getWalletTokenPrices();
    setLoadWalletTokens(false);
  };

  const getSwapFeeTokenValue = async () => {
    const mints = selectedRoute.marketInfos.map((info) => info.lpFee.mint);
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mints.toString()}&vs_currencies=usd`
    );
    const data = await response.json();

    const feeValue = selectedRoute.marketInfos.reduce((a: any, c) => {
      const feeToken: any = tokens.find(
        (item) => item?.address === c.lpFee?.mint
      );

      const amount = c.lpFee?.amount / Math.pow(10, feeToken?.decimals);
      if (data[c.lpFee?.mint]) {
        return a + data[c.lpFee?.mint].usd * amount;
      }
      if (c.lpFee?.mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
        return a + 1 * amount;
      }
    }, 0);

    setFeeValue(feeValue);
  };

  useEffect(() => {
    if (selectedRoute) {
      getSwapFeeTokenValue();
    }
  }, [selectedRoute]);

  useEffect(() => {
    getWalletTokenPrices();
  }, [walletTokensWithInfos]);

  const handleSelectRoute = (route: SetStateAction<RouteInfo>) => {
    setShowRoutesModal(false);
    setSelectedRoute(route);
  };

  const handleSwitchMints = () => {
    setFormValue((val) => ({
      ...val,
      inputMint: formValue.outputMint,
      outputMint: formValue.inputMint,
    }));
  };

  const sortedTokenMints = sortBy(tokens, (token) => {
    return token?.symbol?.toLowerCase();
  });

  const outAmountUi: any = selectedRoute
    ? selectedRoute.outAmount / 10 ** (outputTokenInfo?.decimals || 1)
    : null;

  const swapDisabled = loading || !selectedRoute || routes?.length === 0;

  const inputTokenInfos = inputTokenInfo ? (inputTokenInfo as any) : null;
  const outputTokenInfos = outputTokenInfo ? (outputTokenInfo as any) : null;

  return (
    <div className="grid grid-cols-12 lg:space-x-4">
      <div className="col-span-12 xl:col-span-10 xl:col-start-2 ">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/2  lg:w-1/3">
            <div className="relative z-10">
              {connected &&
              walletTokensWithInfos.length &&
              walletTokenPrices &&
              !isMobile ? (
                <div
                  className={`flex transform top-22 right-0 w-80 fixed overflow-hidden ease-in-out transition-all duration-700 z-30 ${
                    showWalletDraw ? "translate-x-0" : "mr-16 translate-x-full"
                  }`}
                >
                  <aside
                    className={`bg-th-bkg-3 ml-16 pb-4 pt-6 rounded-l-md w-64`}
                  >
                    <div className="max-h-[480px] overflow-auto thin-scroll">
                      <div className="flex items-center justify-between pb-2 px-4">
                        <div>
                          <div className="font-bold text-base text-th-fgd-1">
                            wallet
                          </div>
                          <a
                            className="flex items-center text-th-fgd-3 text-xs hover:text-th-fgd-2"
                            href={`https://explorer.solana.com/address/${wallet?.publicKey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {/* {abbreviateAddress( wallet.publicKey )} */}
                            <ExternalLinkIcon className="h-3.5 ml-0.5 -mt-0.5 w-3.5" />
                          </a>
                        </div>
                        <IconButton onClick={() => refreshWallet()}>
                          <RefreshClockwiseIcon
                            className={`h-4 w-4 ${
                              loadWalletTokens && "animate-spin"
                            }`}
                          />
                        </IconButton>
                      </div>
                      {walletTokensWithInfos
                        .sort((a, b) => {
                          const aId = a.item.extensions?.coingeckoId;
                          const bId = b.item.extensions?.coingeckoId;
                          return (
                            // @ts-ignore
                            b.uiBalance * walletTokenPrices[bId]?.usd -
                            // @ts-ignore
                            a.uiBalance * walletTokenPrices[aId]?.usd
                          );
                        })
                        .filter((item) => TrustedTokenAddresses.includes(item))
                        .map((token) => {
                          const geckoId = token.item.extensions?.coingeckoId;
                          return (
                            <div
                              className="cursor-pointer default-transition flex items-center justify-between px-4 py-2 hover:bg-th-bkg-4"
                              key={geckoId}
                              onClick={() =>
                                setFormValue((val) => ({
                                  ...val,
                                  inputMint: new PublicKey(token?.item.address),
                                }))
                              }
                            >
                              <div className="flex items-center">
                                {token.item.logoURI ? (
                                  <img
                                    className="rounded-full"
                                    src={token.item.logoURI}
                                    width="24"
                                    height="24"
                                    alt={token.item.symbol}
                                  />
                                ) : null}
                                <div>
                                  <div className="ml-2 text-th-fgd-1">
                                    {token.item.symbol}
                                  </div>
                                  {walletTokenPrices ? (
                                    <div className="ml-2 text-th-fgd-4 text-xs">
                                      {walletTokenPrices[geckoId]
                                        ? // @ts-ignore
                                          `$${walletTokenPrices[geckoId].usd}`
                                        : t("swap:unavailable")}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div>
                                <div className="text-right text-th-fgd-1">
                                  {token.uiBalance.toLocaleString(undefined, {
                                    maximumSignificantDigits: 6,
                                  })}
                                </div>
                                <div className="text-th-fgd-4 text-right text-xs">
                                  {walletTokenPrices[geckoId]
                                    ? `$${(
                                        token.uiBalance *
                                        // @ts-ignore
                                        walletTokenPrices[geckoId].usd
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })}`
                                    : "?"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </aside>
                  <button
                    className="absolute bg-th-bkg-4 p-3 right-64 rounded-r-none text-th-fgd-1 hover:text-th-primary top-20"
                    onClick={() => setShowWalletDraw(!showWalletDraw)}
                  >
                    <WalletIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
              <div className="bg-th-bkg-2 rounded-lg p-6">
                <div className="flex justify-between">
                  <label
                    htmlFor="inputMint"
                    className="block text-sm font-semibold"
                  >
                    Pay
                  </label>
                  <div className="space-x-3">
                    <label htmlFor="amount" className="text-th-fgd-3 text-xs">
                      Bal {inputWalletBalance()}
                    </label>
                    {connected ? (
                      <>
                        <LinkButton
                          className="text-th-primary text-xs"
                          onClick={() => {
                            setFormValue((val) => ({
                              ...val,
                              amount: inputWalletBalance(),
                            }));
                          }}
                        >
                          max
                        </LinkButton>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <div className="col-span-1">
                    <button
                      className="hover:bg-th-bkg-3 -ml-2 p-2"
                      onClick={() => setShowInputTokenSelect(true)}
                    >
                      <div className="flex h-8 items-center">
                        {inputTokenInfo?.logoURI ? (
                          <img
                            className="rounded-full"
                            src={inputTokenInfo?.logoURI}
                            width="24"
                            height="24"
                            alt={inputTokenInfo?.symbol}
                          />
                        ) : null}
                        <div className="text-base xl:text-lg ml-2">
                          {inputTokenInfo?.symbol}
                        </div>
                        <ChevronDownIcon className="flex-shrink-0 h-5 w-5 ml-1 text-th-fgd-3" />
                      </div>
                    </button>
                  </div>
                  <div className="col-span-1">
                    <input
                      name="amount"
                      id="amount"
                      className="bg-th-bkg-1 border border-th-fgd-4 default-transition font-bold pr-4 h-12 focus:outline-none rounded-md text-base text-right tracking-wide w-full hover:border-th-primary focus:border-th-primary"
                      value={formValue.amount || ""}
                      placeholder="0.00"
                      type="number"
                      pattern="[0-9]*"
                      onInput={(e: any) => {
                        let newValue = e.target?.value || 0;
                        newValue = Number.isNaN(newValue) ? 0 : newValue;

                        setFormValue((val) => ({
                          ...val,
                          amount: newValue,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-center my-4">
                  <button onClick={handleSwitchMints}>
                    <SwitchVerticalIcon className="default-transition h-8 w-8 rounded-full p-1.5 bg-th-bkg-4 text-th-fgd-1 hover:text-th-primary" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="outputMint" className="font-semibold">
                    receive
                  </label>
                  <span className="text-th-fgd-3 text-xs">
                    Bal {outputWalletBalance()}
                  </span>
                </div>
                <div className="grid grid-cols-2 mt-2">
                  <div className="col-span-1">
                    <button
                      className="flex h-12 items-center hover:bg-th-bkg-3 -ml-2 p-2"
                      onClick={() => setShowOutputTokenSelect(true)}
                    >
                      {outputTokenInfo?.logoURI ? (
                        <img
                          className="rounded-full"
                          src={outputTokenInfo?.logoURI}
                          width="24"
                          height="24"
                          alt={outputTokenInfo?.symbol}
                        />
                      ) : null}
                      <div className="text-base xl:text-lg ml-2">
                        {outputTokenInfo?.symbol}
                      </div>
                      <ChevronDownIcon className="flex-shrink-0 h-5 w-5 ml-1 text-th-fgd-3" />
                    </button>
                  </div>
                  <div className="col-span-1 relative">
                    <input
                      name="amount"
                      id="amount"
                      className="bg-th-bkg-3 border border-th-bkg-4 cursor-not-allowed font-bold pr-4 h-12 focus:outline-none rounded-md text-lg text-right tracking-wide w-full"
                      disabled
                      placeholder="0.00"
                      value={
                        selectedRoute?.outAmount && formValue.amount
                          ? Intl.NumberFormat("en", {
                              minimumSignificantDigits: 1,
                              maximumSignificantDigits: 6,
                            }).format(
                              selectedRoute?.outAmount /
                                10 ** (outputTokenInfo?.decimals || 1)
                            )
                          : ""
                      }
                    />
                    {selectedRoute?.outAmount &&
                    formValue.amount &&
                    // @ts-ignore
                    tokenPrices?.outputTokenPrice ? (
                      <div className="absolute mt-1 right-0 text-th-fgd-3 text-xs">
                        ≈ $
                        {(
                          (selectedRoute?.outAmount /
                            10 ** (outputTokenInfo?.decimals || 1)) *
                          // @ts-ignore
                          tokenPrices?.outputTokenPrice
                        ).toFixed(2)}
                      </div>
                    ) : null}
                  </div>
                </div>

                {routes?.length && selectedRoute ? (
                  <div className="mt-8 text-th-fgd-3 text-xs">
                    <div className="border border-th-bkg-4 mb-4 pb-4 px-3 pt-4 relative rounded-md">
                      {selectedRoute === routes[0] ? (
                        <div className="absolute bg-th-primary font-bold px-1 rounded-sm text-th-bkg-1 text-xs -top-2">
                          best-swap
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold overflow-ellipsis text-sm text-th-fgd-1 whitespace-nowrap">
                            {selectedRoute?.marketInfos.map((info, index) => {
                              let includeSeparator = false;
                              if (
                                selectedRoute?.marketInfos.length > 1 &&
                                index !== selectedRoute?.marketInfos.length - 1
                              ) {
                                includeSeparator = true;
                              }
                              return (
                                <span key={index}>{`${
                                  info.marketMeta.amm.label
                                } ${includeSeparator ? "x " : ""}`}</span>
                              );
                            })}
                          </span>
                          <div className="mr-2 mt-0.5 text-th-fgd-3 text-xs font-normal">
                            {inputTokenInfo?.symbol} →{" "}
                            {selectedRoute?.marketInfos.map((r, index) => {
                              const showArrow =
                                index !== selectedRoute?.marketInfos.length - 1
                                  ? true
                                  : false;
                              return (
                                <span key={index}>
                                  <span>
                                    {
                                      tokens.find(
                                        (item) =>
                                          item?.address ===
                                          r?.outputMint?.toString()
                                      )?.symbol
                                    }
                                  </span>
                                  {showArrow ? " → " : ""}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <Button
                          className="bg-transparent border border-th-fgd-4 font-normal pb-1 pt-1 px-2 rounded-md text-th-fgd-3 text-center text-xs"
                          disabled={routes?.length === 1}
                          onClick={() => setShowRoutesModal(true)}
                        >
                          {/*  {t('swap:routes-found', {
                              numberOfRoutes: routes?.length,
                            })}*/}
                        </Button>
                      </div>
                    </div>
                    <div className="px-3 space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-sm text-th-fgd-1">
                          swap-details
                        </div>
                        <div className="flex items-center space-x-2">
                          <IconButton onClick={() => refresh()}>
                            <RefreshClockwiseIcon
                              className={`h-4 w-4 ${
                                loading ? "animate-spin" : ""
                              }`}
                            />
                          </IconButton>
                          <IconButton onClick={() => setShowSettings(true)}>
                            <CogIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>rate</span>
                        <div>
                          <div className="flex items-center justify-end">
                            <div className="text-right text-th-fgd-1">
                              {swapRate ? (
                                <>
                                  1 {inputTokenInfo?.symbol} ≈{" "}
                                  {numberFormatter.format(
                                    outAmountUi / formValue?.amount
                                  )}{" "}
                                  {outputTokenInfo?.symbol}
                                </>
                              ) : (
                                <>
                                  1 {outputTokenInfo?.symbol} ≈{" "}
                                  {numberFormatter.format(
                                    formValue?.amount / outAmountUi
                                  )}{" "}
                                  {inputTokenInfo?.symbol}
                                </>
                              )}
                            </div>
                            <SwitchHorizontalIcon
                              className="cursor-pointer default-transition h-4 ml-1 text-th-fgd-3 w-4 hover:text-th-fgd-2"
                              onClick={() => setSwapRate(!swapRate)}
                            />
                          </div>

                          {
                            // @ts-ignore
                            tokenPrices?.outputTokenPrice &&
                            // @ts-ignore
                            tokenPrices?.inputTokenPrice ? (
                              <div
                                className={`text-right ${
                                  ((formValue?.amount / outAmountUi -
                                    // @ts-ignore

                                    tokenPrices?.outputTokenPrice /
                                      // @ts-ignore
                                      tokenPrices?.inputTokenPrice) /
                                    (formValue?.amount / outAmountUi)) *
                                    100 <=
                                  0
                                    ? "text-th-green"
                                    : "text-th-red"
                                }`}
                              >
                                {Math.abs(
                                  ((formValue?.amount / outAmountUi -
                                    // @ts-ignore
                                    tokenPrices?.outputTokenPrice /
                                      // @ts-ignore
                                      tokenPrices?.inputTokenPrice) /
                                    (formValue?.amount / outAmountUi)) *
                                    100
                                ).toFixed(1)}
                                %{" "}
                                <span className="text-th-fgd-4">{`${
                                  ((formValue?.amount / outAmountUi -
                                    // @ts-ignore
                                    tokenPrices?.outputTokenPrice /
                                      // @ts-ignore
                                      tokenPrices?.inputTokenPrice) /
                                    (formValue?.amount / outAmountUi)) *
                                    100 <=
                                  0
                                    ? "cheaper"
                                    : "more-expensive"
                                } CoinGecko`}</span>
                              </div>
                            ) : null
                          }
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>price-impact</span>
                        <div className="text-right text-th-fgd-1">
                          {selectedRoute?.priceImpactPct * 100 < 0.1
                            ? "< 0.1%"
                            : `~ ${(
                                selectedRoute?.priceImpactPct * 100
                              ).toFixed(4)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("swap:minimum-received")}</span>
                        <div className="text-right text-th-fgd-1">
                          {numberFormatter.format(
                            selectedRoute?.outAmountWithSlippage /
                              // @ts-ignore
                              10 ** outputTokenInfo?.decimals || 1
                          )}{" "}
                          {outputTokenInfo?.symbol}
                        </div>
                      </div>
                      {
                       
                        !isNaN(feeValue) ? (
                          <div className="flex justify-between">
                            <span>swap-fee</span>
                            <div className="flex items-center">
                              <div className="text-right text-th-fgd-1">
                                ≈ $
                                {
                               
                                  feeValue?.toFixed(2)
                                }
                              </div>
                              <Tooltip
                                content={
                                  <div className="space-y-2.5">
                                    {selectedRoute?.marketInfos.map(
                                      (info, index) => {
                                        const feeToken: any = tokens.find(
                                          (item) =>
                                            item?.address === info.lpFee?.mint
                                        );
                                        return (
                                          <div key={index}>
                                            <span></span>
                                            <div className="text-th-fgd-1">
                                              {(
                                                info.lpFee?.amount /
                                    
                                                Math.pow(10, feeToken?.decimals)
                                              ).toFixed(6)}{" "}
                                              {feeToken?.symbol} (
                                              {info.lpFee?.pct * 100}
                                              %)
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                }
                                placement={"left"}
                              >
                                <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                              </Tooltip>
                            </div>
                          </div>
                        ) : (
                          selectedRoute?.marketInfos.map((info, index) => {
                            const feeToken: any = tokens.find(
                              (item) => item?.address === info.lpFee?.mint
                            );
                            return (
                              <div className="flex justify-between" key={index}>
                                <span>
                                  {/* {t('swap:fees-paid-to', {
                                    feeRecipient: info.marketMeta?.amm?.label,
                                  })}*/}
                                </span>
                                <div className="text-right text-th-fgd-1">
                                  {(
                                    info.lpFee?.amount /
                                    Math.pow(10, feeToken?.decimals)
                                  ).toFixed(6)}{" "}
                                  {feeToken?.symbol} ({info.lpFee?.pct * 100}%)
                                </div>
                              </div>
                            );
                          })
                        )
                      }
                      {connected ? (
                        <>
                          <div className="flex justify-between">
                            <span>transaction-fee</span>
                            <div className="text-right text-th-fgd-1">
                              {depositAndFee
                                ? depositAndFee?.signatureFee / Math.pow(10, 9)
                                : "-"}{" "}
                              SOL
                            </div>
                          </div>

                          {depositAndFee?.ataDepositLength ||
                          depositAndFee?.openOrdersDeposits?.length ? (
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <span>deposit</span>
                                <Tooltip
                                  content={
                                    <>
                                      {depositAndFee?.ataDepositLength ? (
                                        <div>need-ata-account</div>
                                      ) : null}

                                      {depositAndFee?.openOrdersDeposits
                                        ?.length ? (
                                        <div className="mt-2">
                                          serum-requires-openorders
                                          <a
                                            href="https://docs.google.com/document/d/1qEWc_Bmc1aAxyCUcilKB4ZYpOu3B0BxIbe__dRYmVns/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            heres-how
                                          </a>
                                        </div>
                                      ) : null}
                                    </>
                                  }
                                  placement={"left"}
                                >
                                  <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                                </Tooltip>
                              </div>
                              <div>
                                {depositAndFee?.ataDepositLength ? (
                                  <div className="text-right text-th-fgd-1">
                                    {depositAndFee?.ataDepositLength === 1
                                      ? t("swap:ata-deposit-details", {
                                          cost: (
                                            depositAndFee?.ataDeposit /
                                            Math.pow(10, 9)
                                          ).toFixed(5),
                                          count:
                                            depositAndFee?.ataDepositLength,
                                        })
                                      : t("swap:ata-deposit-details_plural", {
                                          cost: (
                                            depositAndFee?.ataDeposit /
                                            Math.pow(10, 9)
                                          ).toFixed(5),
                                          count:
                                            depositAndFee?.ataDepositLength,
                                        })}
                                  </div>
                                ) : null}
                                {depositAndFee?.openOrdersDeposits?.length ? (
                                  <div className="text-right text-th-fgd-1">
                                    {depositAndFee?.openOrdersDeposits.length >
                                    1
                                      ? t("swap:serum-details_plural", {
                                          cost: (
                                            sum(
                                              depositAndFee?.openOrdersDeposits
                                            ) / Math.pow(10, 9)
                                          ).toFixed(5),
                                          count:
                                            depositAndFee?.openOrdersDeposits
                                              .length,
                                        })
                                      : t("swap:serum-details", {
                                          cost: (
                                            sum(
                                              depositAndFee?.openOrdersDeposits
                                            ) / Math.pow(10, 9)
                                          ).toFixed(5),
                                          count:
                                            depositAndFee?.openOrdersDeposits
                                              .length,
                                        })}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {error && (
                  <div className="flex items-center justify-center mt-2 text-th-red">
                    <ExclamationCircleIcon className="h-5 mr-1.5 w-5" />
                    jupiter-error
                  </div>
                )}
                <Button
                  disabled={swapDisabled}
                  onClick={async () => {
                    if (!connected && zeroKey !== wallet?.publicKey) {
                      // @ts-ignore
                      wallet.connect();
                    } else if (!loading && selectedRoute && connected) {
                      setSwapping(true);
                      let txCount = 1;
                      let errorTxid;
                      const swapResult = await exchange({
                        wallet: wallet as any,
                        route: selectedRoute,
                        confirmationWaiterFactory: async (txid, totalTxs) => {
                          console.log("txid, totalTxs", txid, totalTxs);
                          if (txCount === totalTxs) {
                            errorTxid = txid;
                            // @ts-ignore
                            notify({
                              type: "confirm",
                              title: "Confirming Transaction",
                              txid,
                            });
                          }
                          await connection.confirmTransaction(txid);

                          txCount++;
                          return await connection.getTransaction(txid, {
                            commitment: "confirmed",
                          });
                        },
                      });
                      console.log("swapResult", swapResult);

                      setSwapping(false);
                      fetchWalletTokens();
                      if ("error" in swapResult) {
                        console.log("Error:", swapResult.error);
                        // @ts-ignore
                        notify({
                          type: "error",
                          // @ts-ignore
                          title: swapResult.error.name,
                          // @ts-ignore
                          description: swapResult.error.message,
                          txid: errorTxid,
                        });
                      } else if ("txid" in swapResult) {
                        // @ts-ignore
                        notify({
                          type: "success",
                          title: "Swap Successful",
                          description: `Swapped ${
                            // @ts-ignore
                            swapResult.inputAmount /
                            10 ** (inputTokenInfo?.decimals || 1)
                          } ${inputTokenInfo?.symbol} to ${
                            // @ts-ignore
                            swapResult.outputAmount /
                            10 ** (outputTokenInfo?.decimals || 1)
                          } ${outputTokenInfo?.symbol}`,
                          txid: swapResult.txid,
                        });
                        // @ts-ignore
                        setFormValue((val) => ({
                          ...val,
                          amount: null,
                        }));
                      }
                    }
                  }}
                  className="h-12 mt-6 text-base w-full"
                >
                  {connected
                    ? swapping
                      ? swapping
                      : "swap"
                    : "connect-wallet"}
                </Button>
              </div>

              {showRoutesModal ? (
                <Modal
                  isOpen={showRoutesModal}
                  onClose={() => setShowRoutesModal(false)}
                >
                  <div className="font-bold mb-4 text-th-fgd-1 text-center text-lg">
                    {/* {t('swap:routes-found', {
                        numberOfRoutes: routes?.length,
                      })*/}
                  </div>
                  <div className="max-h-96 overflow-x-hidden overflow-y-auto thin-scroll pr-1">
                    {
                      // @ts-ignore
                      routes.map((route, index) => {
                        const selected = selectedRoute === route;
                        return (
                          <div
                            key={index}
                            className={`bg-th-bkg-3 border default-transition rounded mb-2 hover:bg-th-bkg-4 ${
                              selected
                                ? "border-th-primary text-th-primary hover:border-th-primary"
                                : "border-transparent text-th-fgd-1"
                            }`}
                          >
                            <button
                              className="p-4 w-full"
                              onClick={() => handleSelectRoute(route)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col text-left">
                                  <div className="whitespace-nowrap overflow-ellipsis">
                                    {route.marketInfos.map((info, index) => {
                                      let includeSeparator = false;
                                      if (
                                        route.marketInfos.length > 1 &&
                                        index !== route.marketInfos.length - 1
                                      ) {
                                        includeSeparator = true;
                                      }
                                      return (
                                        <span key={index}>{`${
                                          info.marketMeta.amm.label
                                        } ${
                                          includeSeparator ? "x " : ""
                                        }`}</span>
                                      );
                                    })}
                                  </div>
                                  <div className="text-th-fgd-4 text-xs font-normal">
                                    {inputTokenInfo?.symbol} →{" "}
                                    {route.marketInfos.map((r, index) => {
                                      const showArrow =
                                        index !== route.marketInfos.length - 1
                                          ? true
                                          : false;
                                      return (
                                        <span key={index}>
                                          <span>
                                            {
                                              tokens.find(
                                                (item) =>
                                                  item?.address ===
                                                  r?.outputMint?.toString()
                                              )?.symbol
                                            }
                                          </span>
                                          {showArrow ? " → " : ""}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="text-lg">
                                  {numberFormatter.format(
                                    route.outAmount /
                                      10 ** (outputTokenInfo?.decimals || 1)
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })
                    }
                  </div>
                </Modal>
              ) : null}
              {showInputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showInputTokenSelect}
                  onClose={() => setShowInputTokenSelect(false)}
                  sortedTokenMints={sortedTokenMints}
                  onTokenSelect={(token) => {
                    setShowInputTokenSelect(false);
                    setFormValue((val) => ({
                      ...val,
                      inputMint: new PublicKey(token?.address),
                    }));
                  }}
                />
              ) : null}
              {showOutputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showOutputTokenSelect}
                  onClose={() => setShowOutputTokenSelect(false)}
                  sortedTokenMints={outputTokenMints}
                  onTokenSelect={(token) => {
                    setShowOutputTokenSelect(false);
                    setFormValue((val) => ({
                      ...val,
                      outputMint: new PublicKey(token?.address),
                    }));
                  }}
                />
              ) : null}
              {showSettings ? (
                <SwapSettingsModal
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  slippage={slippage}
                  setSlippage={setSlippage}
                />
              ) : null}
              {connected && !hasSwapped ? (
                <Modal isOpen={!hasSwapped} onClose={() => setHasSwapped(true)}>
                  <ElementTitle>get-started</ElementTitle>
                  <div className="flex flex-col justify-center">
                    <div className="text-center text-th-fgd-3">
                      swap-in-wallet
                    </div>
                  </div>
                </Modal>
              ) : null}
              {showInputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showInputTokenSelect}
                  onClose={() => setShowInputTokenSelect(false)}
                  sortedTokenMints={sortedTokenMints}
                  onTokenSelect={(token) => {
                    setShowInputTokenSelect(false);
                    setFormValue((val) => ({
                      ...val,
                      inputMint: new PublicKey(token?.address),
                    }));
                  }}
                />
              ) : null}
              {showOutputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showOutputTokenSelect}
                  onClose={() => setShowOutputTokenSelect(false)}
                  sortedTokenMints={outputTokenMints}
                  onTokenSelect={(token) => {
                    setShowOutputTokenSelect(false);
                    setFormValue((val) => ({
                      ...val,
                      outputMint: new PublicKey(token?.address),
                    }));
                  }}
                />
              ) : null}
            </div>
          </div>
          <div className="py-4 md:py-0 w-full md:w-1/2 lg:w-2/3">
            <SwapTokenInfo
              inputTokenId={inputTokenInfos?.extensions?.coingeckoId}
              outputTokenId={outputTokenInfos?.extensions?.coingeckoId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JupiterForm;
