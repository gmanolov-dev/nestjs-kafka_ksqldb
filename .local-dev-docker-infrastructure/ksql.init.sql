CREATE STREAM `exchange_pair_prices_stream` (ROWKEY STRING KEY, EXCHANGE STRING, PAIR STRING, `size` DOUBLE, PRICE DOUBLE, TYPE STRING, TIME STRING) 
  WITH (KAFKA_TOPIC='events.exchange.ticker', KEY_FORMAT='KAFKA', PARTITIONS=1, TIMESTAMP='time', TIMESTAMP_FORMAT='yyyy-MM-dd''T''HH:mm:ss.SSS''Z''', VALUE_FORMAT='JSON');

CREATE TABLE `exchange_pair_prices_table_last`
  WITH (KAFKA_TOPIC='exchange_pair_prices_table_last', KEY_FORMAT='DELIMITED', PARTITIONS=1, REPLICAS=1)
AS SELECT
  AS_VALUE(`exchange_pair_prices_stream`.EXCHANGE) `exchange`,   `exchange_pair_prices_stream`.EXCHANGE EX,
  AS_VALUE(`exchange_pair_prices_stream`.PAIR) `pair`,   `exchange_pair_prices_stream`.PAIR PR,
  AS_VALUE(`exchange_pair_prices_stream`.TYPE) `type`,   `exchange_pair_prices_stream`.TYPE TP,
  TIMESTAMPTOSTRING(WINDOWEND, 'yyyy-MM-dd''T''HH:mm:ss.SSS''Z''') `time`,
  MAX(`exchange_pair_prices_stream`.PRICE) `price`,
  SUM(`exchange_pair_prices_stream`.`size`) `size`,
  WINDOWSTART `window_start`,
  WINDOWEND `window_end`
FROM `exchange_pair_prices_stream` `exchange_pair_prices_stream`
  WINDOW TUMBLING ( SIZE 10 SECONDS , RETENTION 60 SECONDS , GRACE PERIOD 0 SECONDS )
GROUP BY `exchange_pair_prices_stream`.EXCHANGE, `exchange_pair_prices_stream`.PAIR, `exchange_pair_prices_stream`.TYPE
EMIT FINAL;