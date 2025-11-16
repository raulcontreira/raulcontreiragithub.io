import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getCurrentWeatherByCity, getCurrentWeatherByCoords, getForecastByCity } from "./weatherService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  weather: router({
    getCurrentByCity: publicProcedure
      .input(z.object({ city: z.string().min(1) }))
      .query(async ({ input }) => {
        return await getCurrentWeatherByCity(input.city);
      }),
    
    getCurrentByCoords: publicProcedure
      .input(z.object({ lat: z.number(), lon: z.number() }))
      .query(async ({ input }) => {
        return await getCurrentWeatherByCoords(input.lat, input.lon);
      }),
    
    getForecast: publicProcedure
      .input(z.object({ city: z.string().min(1) }))
      .query(async ({ input }) => {
        return await getForecastByCity(input.city);
      }),
  }),
});

export type AppRouter = typeof appRouter;
