import express from "express";
import * as relationshipController from "../controllers/relationshipController.js";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import * as relationshipMiddleware from "../middlewares/relationshipMiddleware.js";

const router = express.Router();

router.get(
  "/friends/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isProfileOwnerOrFriendOrAdmin,
  relationshipController.getRelationships,
);
router.get(
  "/:type/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isProfileOwnerOrAdmin,
  relationshipController.getRelationships,
);

router.put(
  "/askForFriendship/:strangerId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.validateStrangerId,
  relationshipMiddleware.getRelationships,
  relationshipMiddleware.getStrangerRelationships,
  relationshipMiddleware.isUserSelfRequest,
  relationshipMiddleware.isFriendshipAlreadyAsked,
  relationshipMiddleware.isUserAlreadyFriendWith,
  relationshipMiddleware.isUserIgnored,
  relationshipController.askForFriendship,
);
router.put(
  "/acceptFriendshipRequest/:strangerId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.validateStrangerId,
  relationshipMiddleware.getRelationships,
  relationshipMiddleware.getStrangerRelationships,
  relationshipMiddleware.isUserSelfRequest,
  relationshipMiddleware.isUserAlreadyFriendWith,
  relationshipMiddleware.isUserIgnored,
  relationshipController.acceptFriendshipRequest,
);
router.put(
  "/denyFriendshipRequest/:strangerId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.validateStrangerId,
  relationshipController.denyFriendshipRequest,
);
router.put(
  "/suggestFriendship/:friendId/to/:strangerId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.validateStrangerId,
  relationshipMiddleware.getRelationships,
  relationshipMiddleware.getFriendRelationships,
  relationshipMiddleware.getStrangerRelationships,
  relationshipMiddleware.isUserSelfRequest,
  relationshipMiddleware.isUserFriendWith,
  relationshipMiddleware.isSuggestionAlreadyDone,
  relationshipMiddleware.isStrangerAlreadyFriendWithSuggested,
  relationshipMiddleware.isStrangerOrSuggestedIgnored,
  relationshipController.suggestFriendship,
);
router.put(
  "/ignoreSuggestion/:strangerId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.validateStrangerId,
  relationshipMiddleware.getRelationships,
  relationshipController.ignoreSuggestion,
);
router.put(
  "/removeFriend/:friendId",
  userMiddleware.isAuthenticated,
  relationshipMiddleware.getRelationships,
  relationshipMiddleware.getFriendRelationships,
  relationshipMiddleware.isUserFriendWith,
  relationshipController.removeFriend,
);
router.put(
  "/removeFriendFrom/:strangerId/to/:friendId",
  userMiddleware.isAuthenticated,
  userMiddleware.isAdmin,
  relationshipMiddleware.getStrangerRelationships,
  relationshipMiddleware.getFriendRelationships,
  relationshipController.removeFriendFromProfile,
);

export default router;
