import { Router } from "express";
import usersRouter from "./users.mjs"
import productsRouter from "./products.mjs"
import cookieRouter from "../cookies/cookie.mjs"
import authenticationRouter from "./passport_authentication.mjs"
// import sessionRouter from '../session/session.mjs'

const router = Router();

// Attach cookieRouter to handle cookie-related routes
router.use(cookieRouter);

// Attach sessionRouter to handle session-related routes
// router.use(sessionRouter);

// Attach usersRouter to handle user-related routes
router.use(usersRouter);

// Attach productsRouter to handle product-related routes
router.use(productsRouter);

// Attach authenticationRouter to handle authentcation-related routes
router.use(authenticationRouter);

export default router;