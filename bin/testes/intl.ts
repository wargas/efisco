export const createFormatter = (locale: string) => {
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  });

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
  });

  const durationFormatter = new Intl.RelativeTimeFormat(locale, {
    style: "short",
  });

  return {
    currencyFormatter: (v: number) => currencyFormatter.format(v),
    dateFormatter: (v: Date) => dateFormatter.format(v),
    durationFormatter: (v: number) => durationFormatter.format(v, "days"),
  };
};
const format = createFormatter("pt-BR");
console.log(format.currencyFormatter(1000));
console.log(format.dateFormatter(new Date()));
