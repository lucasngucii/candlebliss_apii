import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import Redis, { ChainableCommander, Redis as RedisClient } from 'ioredis';
import { deflate, inflate } from 'zlib';
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;

  private logger = new Logger(RedisService.name);
  async onModuleInit(): Promise<void> {
    this.client = await this.initClient();
  }

  private initClient(isSub: boolean = false): Promise<RedisClient> {
    const client = new Redis({
      name: 'candlebliss',
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      // password: process.env.REDIS_PASSWORD,
      db: 2,
      lazyConnect: true,
      keepAlive: 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 1000, 30000);
        this.logger.warn(`Redis connection failed. Retrying in ${delay}ms...`);
        return delay;
      },
    });

    client.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });

    client.on('connect', () => {
      Logger.log(
        `Redis is connected - ${isSub ? 'subscriber' : 'publisher'}`,
        RedisService.name,
      );
    });

    client.on('ready', () => {
      this.logger.log('Redis ready');
    });
    client.on('close', () => {
      this.logger.log('Redis connection closed');
    });

    client.on('reconnecting', () => {
      this.logger.log('Redis reconnecting');
    });

    return Promise.resolve(client);
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit();
  }

  async getClient(): Promise<RedisClient> {
    if (!this.client || !this.client.status || this.client.status !== 'ready') {
      await this.initClient();
    }

    return this.client;
  }

  public pipeline(): ChainableCommander | null {
    return this.client ? this.client.pipeline() : null;
  }

  public scanStream(match: string, count: number) {
    return this.client.scanStream({
      match: match,
      count: count,
    });
  }
  async keyExists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      Logger.error(error.stack, RedisService.name);
      return false;
    }
  }

  async del(key: string, cb?: () => void): Promise<void> {
    try {
      await this.client.del(key);

      if (cb !== undefined) cb();
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async mset(map: Map<string, string | number | Buffer>): Promise<void> {
    try {
      await this.client.mset(map);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }
  async sadd(key: string, data: string): Promise<any> {
    try {
      if (data.length > 0) await this.client.sadd(key, data);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async smismember(
    key: string,
    data: (string | number | Buffer)[],
  ): Promise<number[]> {
    try {
      if (data.length <= 0) return Array.of();

      const result = await this.client.smismember(key, data);
      return result;
    } catch (err: any) {
      Logger.error(err, true, RedisService.name);

      return Array.of();
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      const result = await this.client.smembers(key);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return [];
    }
  }
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async lock(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.client.set(key, 'locked', 'EX', ttl, 'NX');
      return result === 'OK';
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return false;
    }
  }
  async hmset<K, V>(hKey: string, data: Map<K, V>): Promise<any> {
    try {
      if (data.size <= 0) return;

      const tmp: Map<string, string> = new Map();
      for (const k of data.keys()) {
        const v = data.get(k);

        if (v instanceof Object) tmp.set(k as string, JSON.stringify(v));
        else if ((v as string) !== '') tmp.set(k as string, v as string);
      }

      const result = await this.client.hmset(hKey, tmp);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async setex(key: string, ttl: number, data: string): Promise<void> {
    try {
      await this.client.setex(key, ttl, data);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async hmdel(hKey: string, data: string[]): Promise<void> {
    try {
      if (data.length > 0) await this.client.hdel(hKey, ...data);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }
  async hmgetAll(hKey: string): Promise<Record<string, string>> {
    try {
      const result = await this.client.hgetall(hKey);
      return result;
    } catch (err: any) {
      if (err !== '') Logger.error(err.stack, RedisService.name);

      return {};
    }
  }

  async hgetall<T>(hkey: string): Promise<Map<string, T>> {
    const mapResult: Map<string, T> = new Map();

    try {
      const results = await this.client.hgetall(hkey);

      for (const key of Object.keys(results)) {
        try {
          mapResult.set(key, JSON.parse(results[key]));
        } catch {
          mapResult.set(key, results[key] as any);
        }
      }

      return mapResult;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return mapResult;
    }
  }

  async hget(hKey: string, fields: string): Promise<string | null> {
    try {
      const result = await this.client.hget(hKey, fields);
      return result;
    } catch (err: any) {
      if (err !== '') Logger.error(err.stack, RedisService.name);

      return null;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.client.get(key);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return null;
    }
  }

  async set(key: string, data: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        const result = await this.client.set(key, data, 'EX', ttl, 'NX');
        return result === 'OK';
      }
      await this.client.set(key, data);
      return true;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return false;
    }
  }

  async hmget(hKey: string, fields: string[]): Promise<Array<string>> {
    try {
      if (fields.length <= 0) throw '';

      const result = await this.client.hmget(hKey, ...fields);

      return result.filter((m) => m !== null) as string[];
    } catch (err: any) {
      if (err !== '') Logger.error(err.stack, RedisService.name);

      return [];
    }
  }

  async hmgetV2(hKey: string, fields: string[]): Promise<Array<string | null>> {
    try {
      if (fields.length <= 0) throw '';

      const result = await this.client.hmget(hKey, ...fields);

      return result;
    } catch (err: any) {
      if (err !== '') Logger.error(err.stack, RedisService.name);

      return [];
    }
  }

  async hvalsMap<T>(hKey: string, keyMap: string): Promise<Map<string, T>> {
    try {
      const resultMap: Map<string, T> = new Map();
      const results = await this.client.hvals(hKey);

      results.forEach((m) => {
        const obj = JSON.parse(m);
        resultMap.set(obj[keyMap], obj);
      });

      return resultMap;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return new Map();
    }
  }

  /**
   * Convert results from cache to map
   * @param hkey
   * @param fields
   *
   * To retrieve a value for a specific purpose,
   * create a key in the map, and then return the corresponding result.
   * @param keyMap
   */
  async hmgetMap<T>(
    hkey: string,
    fields: string[],
    keyMap: string,
  ): Promise<Map<string, T>> {
    const mapReturn: Map<string, T> = new Map();

    try {
      const results = await this.hmget(hkey, fields);

      for (const result of results) {
        try {
          const obj = JSON.parse(result);
          mapReturn.set(obj[keyMap], obj);
        } catch (err: any) {
          Logger.error(err.stack, RedisService.name);
        }
      }

      return mapReturn;
    } catch (err: any) {
      Logger.error(err.stack, RedisClient.name);
      return mapReturn;
    }
  }

  /**
   * @param hKey
   * @param data
   * @param key
   * @returns array string
   */
  async hmgetByKey(
    hKey: string,
    data: object[],
    key: string,
  ): Promise<string[]> {
    try {
      const fields: string[] = [];
      data.forEach((v) => fields.push(v[key]));

      return await this.hmget(hKey, fields);
    } catch (err: any) {
      Logger.error(err, true, RedisService.name);
      return [];
    }
  }

  /**
   * @param hKey
   * @param data
   * @param key
   * @returns map objects
   */
  async hmgetByKeyV2<T>(
    hKey: string,
    data: object[],
    key: string,
  ): Promise<Map<string, T>> {
    try {
      const mResult: Map<string, T> = new Map();
      const fields: string[] = [];
      data.forEach((v) => fields.push(v[key]));

      const result = await this.hmget(hKey, fields);

      for (let i = 0; i < result.length; i++) {
        try {
          const obj = JSON.parse(result[i]);
          mResult.set(obj[key], obj);
        } catch (err: any) {
          Logger.error(err.stack, RedisService.name);
        }
      }

      return mResult;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return new Map();
    }
  }

  async rpush(key: string, data: any[]): Promise<void> {
    try {
      if (data.length > 0) await this.client.rpush(key, ...data);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async lrange(key: string): Promise<string[]> {
    try {
      const result = await this.client.lrange(key, 0, -1);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return [];
    }
  }

  async lrangeV2(key: string, start: number, end: number): Promise<string[]> {
    try {
      const result = await this.client.lrange(key, start, end);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return [];
    }
  }

  async ltrim(key: string, start: number, stop: number) {
    try {
      await this.client.ltrim(key, start, stop);
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  async hlen(key: string): Promise<number> {
    try {
      const result = await this.client.hlen(key);
      return result;
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
      return -1;
    }
  }

  public passPipline(
    results: [error: Error | null, result: unknown][] | null,
  ): boolean {
    if (!results) return false;

    for (const r of results) {
      if (r[0]) return false;
    }

    return true;
  }

  public async publish(
    topic: string,
    msg: string,
    isCompress: boolean = true,
  ): Promise<void> {
    try {
      if (!isCompress) await this.client.publish(topic, msg);
      else
        this.compressMsg(msg, (buff: string) =>
          this.client.publish(topic, buff),
        );
    } catch (err: any) {
      Logger.error(err.stack, RedisService.name);
    }
  }

  // public createMsg<T>(
  //   sport: string,
  //   data: T,
  //   action: RedisMsgAction = RedisMsgAction.Update,
  // ): string {
  //   const msg: RedisMsg<T> = {
  //     sport: sport,
  //     action: action,
  //     data: data,
  //   };

  //   return JSON.stringify(msg);
  // }

  private compressMsg(
    data: string,
    onCompressComplete: (buff: string) => void,
  ): void {
    deflate(data, (err: Error, result: Buffer) => {
      if (err) {
        Logger.error(err.stack);
        return;
      }

      onCompressComplete(result.toString('latin1'));
    });
  }

  public decompressMsg(
    buf: string | Buffer,
    onComplete: (data: string) => void,
  ): void {
    inflate(buf, (err: Error, result: Buffer) => {
      if (err) {
        Logger.error(err.stack, 'decompressMsg');
        return;
      }

      onComplete(result.toString());
    });
  }

  public isReady(): boolean {
    return this.client && this.client.status === 'ready';
  }
}
