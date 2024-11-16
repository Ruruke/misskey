SELECT 
  "note"."id" AS "note_id", 
  "note"."replyId" AS "note_replyId", 
  "note"."renoteId" AS "note_renoteId", 
  "note"."threadId" AS "note_threadId", 
  "note"."text" AS "note_text", 
  "note"."name" AS "note_name", 
  "note"."cw" AS "note_cw", 
  "note"."userId" AS "note_userId", 
  "note"."localOnly" AS "note_localOnly", 
  "note"."reactionAcceptance" AS "note_reactionAcceptance", 
  "note"."renoteCount" AS "note_renoteCount", 
  "note"."repliesCount" AS "note_repliesCount", 
  "note"."clippedCount" AS "note_clippedCount", 
  "note"."reactions" AS "note_reactions", 
  "note"."visibility" AS "note_visibility", 
  "note"."uri" AS "note_uri", 
  "note"."url" AS "note_url", 
  "note"."fileIds" AS "note_fileIds", 
  "note"."attachedFileTypes" AS "note_attachedFileTypes", 
  "note"."visibleUserIds" AS "note_visibleUserIds", 
  "note"."mentions" AS "note_mentions", 
  "note"."mentionedRemoteUsers" AS "note_mentionedRemoteUsers", 
  "note"."reactionAndUserPairCache" AS "note_reactionAndUserPairCache", 
  "note"."emojis" AS "note_emojis", 
  "note"."tags" AS "note_tags", 
  "note"."hasPoll" AS "note_hasPoll", 
  "note"."channelId" AS "note_channelId", 
  "note"."userHost" AS "note_userHost", 
  "note"."replyUserId" AS "note_replyUserId", 
  "note"."replyUserHost" AS "note_replyUserHost", 
  "note"."renoteUserId" AS "note_renoteUserId", 
  "note"."renoteUserHost" AS "note_renoteUserHost", 
  "user"."id" AS "user_id", 
  "user"."updatedAt" AS "user_updatedAt", 
  "user"."lastFetchedAt" AS "user_lastFetchedAt", 
  "user"."lastActiveDate" AS "user_lastActiveDate", 
  "user"."hideOnlineStatus" AS "user_hideOnlineStatus", 
  "user"."username" AS "user_username", 
  "user"."name" AS "user_name", 
  "user"."followersCount" AS "user_followersCount", 
  "user"."followingCount" AS "user_followingCount", 
  "user"."movedToUri" AS "user_movedToUri", 
  "user"."movedAt" AS "user_movedAt", 
  "user"."alsoKnownAs" AS "user_alsoKnownAs", 
  "user"."notesCount" AS "user_notesCount", 
  "user"."avatarId" AS "user_avatarId", 
  "user"."bannerId" AS "user_bannerId", 
  "user"."avatarUrl" AS "user_avatarUrl", 
  "user"."bannerUrl" AS "user_bannerUrl", 
  "user"."avatarBlurhash" AS "user_avatarBlurhash", 
  "user"."bannerBlurhash" AS "user_bannerBlurhash", 
  "user"."avatarDecorations" AS "user_avatarDecorations", 
  "user"."tags" AS "user_tags", 
  "user"."score" AS "user_score", 
  "user"."isSuspended" AS "user_isSuspended", 
  "user"."isLocked" AS "user_isLocked", 
  "user"."isBot" AS "user_isBot", 
  "user"."isCat" AS "user_isCat", 
  "user"."isRoot" AS "user_isRoot", 
  "user"."isExplorable" AS "user_isExplorable", 
  "user"."isHibernated" AS "user_isHibernated", 
  "user"."requireSigninToViewContents" AS "user_requireSigninToViewContents", 
  "user"."makeNotesFollowersOnlyBefore" AS "user_makeNotesFollowersOnlyBefore", 
  "user"."makeNotesHiddenBefore" AS "user_makeNotesHiddenBefore", 
  "user"."isDeleted" AS "user_isDeleted", 
  "user"."emojis" AS "user_emojis", 
  "user"."host" AS "user_host", 
  "user"."inbox" AS "user_inbox", 
  "user"."sharedInbox" AS "user_sharedInbox", 
  "user"."featured" AS "user_featured", 
  "user"."uri" AS "user_uri", 
  "user"."followersUri" AS "user_followersUri", 
  "user"."token" AS "user_token", 
  "reply"."id" AS "reply_id", 
  "reply"."replyId" AS "reply_replyId", 
  "reply"."renoteId" AS "reply_renoteId", 
  "reply"."threadId" AS "reply_threadId", 
  "reply"."text" AS "reply_text", 
  "reply"."name" AS "reply_name", 
  "reply"."cw" AS "reply_cw", 
  "reply"."userId" AS "reply_userId", 
  "reply"."localOnly" AS "reply_localOnly", 
  "reply"."reactionAcceptance" AS "reply_reactionAcceptance", 
  "reply"."renoteCount" AS "reply_renoteCount", 
  "reply"."repliesCount" AS "reply_repliesCount", 
  "reply"."clippedCount" AS "reply_clippedCount", 
  "reply"."reactions" AS "reply_reactions", 
  "reply"."visibility" AS "reply_visibility", 
  "reply"."uri" AS "reply_uri", 
  "reply"."url" AS "reply_url", 
  "reply"."fileIds" AS "reply_fileIds", 
  "reply"."attachedFileTypes" AS "reply_attachedFileTypes", 
  "reply"."visibleUserIds" AS "reply_visibleUserIds", 
  "reply"."mentions" AS "reply_mentions", 
  "reply"."mentionedRemoteUsers" AS "reply_mentionedRemoteUsers", 
  "reply"."reactionAndUserPairCache" AS "reply_reactionAndUserPairCache", 
  "reply"."emojis" AS "reply_emojis", 
  "reply"."tags" AS "reply_tags", 
  "reply"."hasPoll" AS "reply_hasPoll", 
  "reply"."channelId" AS "reply_channelId", 
  "reply"."userHost" AS "reply_userHost", 
  "reply"."replyUserId" AS "reply_replyUserId", 
  "reply"."replyUserHost" AS "reply_replyUserHost", 
  "reply"."renoteUserId" AS "reply_renoteUserId", 
  "reply"."renoteUserHost" AS "reply_renoteUserHost", 
  "renote"."id" AS "renote_id", 
  "renote"."replyId" AS "renote_replyId", 
  "renote"."renoteId" AS "renote_renoteId", 
  "renote"."threadId" AS "renote_threadId", 
  "renote"."text" AS "renote_text", 
  "renote"."name" AS "renote_name", 
  "renote"."cw" AS "renote_cw", 
  "renote"."userId" AS "renote_userId", 
  "renote"."localOnly" AS "renote_localOnly", 
  "renote"."reactionAcceptance" AS "renote_reactionAcceptance", 
  "renote"."renoteCount" AS "renote_renoteCount", 
  "renote"."repliesCount" AS "renote_repliesCount", 
  "renote"."clippedCount" AS "renote_clippedCount", 
  "renote"."reactions" AS "renote_reactions", 
  "renote"."visibility" AS "renote_visibility", 
  "renote"."uri" AS "renote_uri", 
  "renote"."url" AS "renote_url", 
  "renote"."fileIds" AS "renote_fileIds", 
  "renote"."attachedFileTypes" AS "renote_attachedFileTypes", 
  "renote"."visibleUserIds" AS "renote_visibleUserIds", 
  "renote"."mentions" AS "renote_mentions", 
  "renote"."mentionedRemoteUsers" AS "renote_mentionedRemoteUsers", 
  "renote"."reactionAndUserPairCache" AS "renote_reactionAndUserPairCache", 
  "renote"."emojis" AS "renote_emojis", 
  "renote"."tags" AS "renote_tags", 
  "renote"."hasPoll" AS "renote_hasPoll", 
  "renote"."channelId" AS "renote_channelId", 
  "renote"."userHost" AS "renote_userHost", 
  "renote"."replyUserId" AS "renote_replyUserId", 
  "renote"."replyUserHost" AS "renote_replyUserHost", 
  "renote"."renoteUserId" AS "renote_renoteUserId", 
  "renote"."renoteUserHost" AS "renote_renoteUserHost", 
  "replyUser"."id" AS "replyUser_id", 
  "replyUser"."updatedAt" AS "replyUser_updatedAt", 
  "replyUser"."lastFetchedAt" AS "replyUser_lastFetchedAt", 
  "replyUser"."lastActiveDate" AS "replyUser_lastActiveDate", 
  "replyUser"."hideOnlineStatus" AS "replyUser_hideOnlineStatus", 
  "replyUser"."username" AS "replyUser_username", 
  "replyUser"."name" AS "replyUser_name", 
  "replyUser"."followersCount" AS "replyUser_followersCount", 
  "replyUser"."followingCount" AS "replyUser_followingCount", 
  "replyUser"."movedToUri" AS "replyUser_movedToUri", 
  "replyUser"."movedAt" AS "replyUser_movedAt", 
  "replyUser"."alsoKnownAs" AS "replyUser_alsoKnownAs", 
  "replyUser"."notesCount" AS "replyUser_notesCount", 
  "replyUser"."avatarId" AS "replyUser_avatarId", 
  "replyUser"."bannerId" AS "replyUser_bannerId", 
  "replyUser"."avatarUrl" AS "replyUser_avatarUrl", 
  "replyUser"."bannerUrl" AS "replyUser_bannerUrl", 
  "replyUser"."avatarBlurhash" AS "replyUser_avatarBlurhash", 
  "replyUser"."bannerBlurhash" AS "replyUser_bannerBlurhash", 
  "replyUser"."avatarDecorations" AS "replyUser_avatarDecorations", 
  "replyUser"."tags" AS "replyUser_tags", 
  "replyUser"."score" AS "replyUser_score", 
  "replyUser"."isSuspended" AS "replyUser_isSuspended", 
  "replyUser"."isLocked" AS "replyUser_isLocked", 
  "replyUser"."isBot" AS "replyUser_isBot", 
  "replyUser"."isCat" AS "replyUser_isCat", 
  "replyUser"."isRoot" AS "replyUser_isRoot", 
  "replyUser"."isExplorable" AS "replyUser_isExplorable", 
  "replyUser"."isHibernated" AS "replyUser_isHibernated", 
  "replyUser"."requireSigninToViewContents" AS "replyUser_requireSigninToViewContents", 
  "replyUser"."makeNotesFollowersOnlyBefore" AS "replyUser_makeNotesFollowersOnlyBefore", 
  "replyUser"."makeNotesHiddenBefore" AS "replyUser_makeNotesHiddenBefore", 
  "replyUser"."isDeleted" AS "replyUser_isDeleted", 
  "replyUser"."emojis" AS "replyUser_emojis", 
  "replyUser"."host" AS "replyUser_host", 
  "replyUser"."inbox" AS "replyUser_inbox", 
  "replyUser"."sharedInbox" AS "replyUser_sharedInbox", 
  "replyUser"."featured" AS "replyUser_featured", 
  "replyUser"."uri" AS "replyUser_uri", 
  "replyUser"."followersUri" AS "replyUser_followersUri", 
  "replyUser"."token" AS "replyUser_token", 
  "renoteUser"."id" AS "renoteUser_id", 
  "renoteUser"."updatedAt" AS "renoteUser_updatedAt", 
  "renoteUser"."lastFetchedAt" AS "renoteUser_lastFetchedAt", 
  "renoteUser"."lastActiveDate" AS "renoteUser_lastActiveDate", 
  "renoteUser"."hideOnlineStatus" AS "renoteUser_hideOnlineStatus", 
  "renoteUser"."username" AS "renoteUser_username", 
  "renoteUser"."name" AS "renoteUser_name", 
  "renoteUser"."followersCount" AS "renoteUser_followersCount", 
  "renoteUser"."followingCount" AS "renoteUser_followingCount", 
  "renoteUser"."movedToUri" AS "renoteUser_movedToUri", 
  "renoteUser"."movedAt" AS "renoteUser_movedAt", 
  "renoteUser"."alsoKnownAs" AS "renoteUser_alsoKnownAs", 
  "renoteUser"."notesCount" AS "renoteUser_notesCount", 
  "renoteUser"."avatarId" AS "renoteUser_avatarId", 
  "renoteUser"."bannerId" AS "renoteUser_bannerId", 
  "renoteUser"."avatarUrl" AS "renoteUser_avatarUrl", 
  "renoteUser"."bannerUrl" AS "renoteUser_bannerUrl", 
  "renoteUser"."avatarBlurhash" AS "renoteUser_avatarBlurhash", 
  "renoteUser"."bannerBlurhash" AS "renoteUser_bannerBlurhash", 
  "renoteUser"."avatarDecorations" AS "renoteUser_avatarDecorations", 
  "renoteUser"."tags" AS "renoteUser_tags", 
  "renoteUser"."score" AS "renoteUser_score", 
  "renoteUser"."isSuspended" AS "renoteUser_isSuspended", 
  "renoteUser"."isLocked" AS "renoteUser_isLocked", 
  "renoteUser"."isBot" AS "renoteUser_isBot", 
  "renoteUser"."isCat" AS "renoteUser_isCat", 
  "renoteUser"."isRoot" AS "renoteUser_isRoot", 
  "renoteUser"."isExplorable" AS "renoteUser_isExplorable", 
  "renoteUser"."isHibernated" AS "renoteUser_isHibernated", 
  "renoteUser"."requireSigninToViewContents" AS "renoteUser_requireSigninToViewContents", 
  "renoteUser"."makeNotesFollowersOnlyBefore" AS "renoteUser_makeNotesFollowersOnlyBefore", 
  "renoteUser"."makeNotesHiddenBefore" AS "renoteUser_makeNotesHiddenBefore", 
  "renoteUser"."isDeleted" AS "renoteUser_isDeleted", 
  "renoteUser"."emojis" AS "renoteUser_emojis", 
  "renoteUser"."host" AS "renoteUser_host", 
  "renoteUser"."inbox" AS "renoteUser_inbox", 
  "renoteUser"."sharedInbox" AS "renoteUser_sharedInbox", 
  "renoteUser"."featured" AS "renoteUser_featured", 
  "renoteUser"."uri" AS "renoteUser_uri", 
  "renoteUser"."followersUri" AS "renoteUser_followersUri", 
  "renoteUser"."token" AS "renoteUser_token" 
FROM 
  "note" "note" 
  INNER JOIN "user" "user" ON "user"."id" = "note"."userId" 
  LEFT JOIN "note" "reply" ON "reply"."id" = "note"."replyId" 
  LEFT JOIN "note" "renote" ON "renote"."id" = "note"."renoteId" 
  LEFT JOIN "user" "replyUser" ON "replyUser"."id" = "reply"."userId" 
  LEFT JOIN "user" "renoteUser" ON "renoteUser"."id" = "renote"."userId" 
WHERE 
  "note"."text" @~ 'misskey中' 
  AND (
    (
      "note"."visibility" = 'public' 
      OR "note"."visibility" = 'home'
    ) 
    OR "note"."userId" = '9vaew1esmfme0001' 
    OR ARRAY['9vaew1esmfme0001'::varchar] <@ "note"."visibleUserIds" 
    OR ARRAY['9vaew1esmfme0001'::varchar] <@ "note"."mentions" 
    OR (
      "note"."visibility" = 'followers' 
      AND (
        "note"."userId" IN (
          SELECT 
            "following"."followeeId" AS "following_followeeId" 
          FROM 
            "following" "following" 
          WHERE 
            "following"."followerId" = '9vaew1esmfme0001'
        ) 
        OR "note"."replyUserId" = '9vaew1esmfme0001'
      )
    )
  ) 
  AND "note"."userId" NOT IN (
    SELECT 
      "muting"."muteeId" AS "muting_muteeId" 
    FROM 
      "muting" "muting" 
    WHERE 
      "muting"."muterId" = '9vaew1esmfme0001'
  ) 
  AND (
    "note"."replyUserId" IS NULL 
    OR "note"."replyUserId" NOT IN (
      SELECT 
        "muting"."muteeId" AS "muting_muteeId" 
      FROM 
        "muting" "muting" 
      WHERE 
        "muting"."muterId" = '9vaew1esmfme0001'
    )
  ) 
  AND (
    "note"."renoteUserId" IS NULL 
    OR "note"."renoteUserId" NOT IN (
      SELECT 
        "muting"."muteeId" AS "muting_muteeId" 
      FROM 
        "muting" "muting" 
      WHERE 
        "muting"."muterId" = '9vaew1esmfme0001'
    )
  ) 
  AND (
    "note"."userHost" IS NULL 
    OR NOT (
      (
        SELECT 
          "user_profile"."mutedInstances" AS "user_profile_mutedInstances" 
        FROM 
          "user_profile" "user_profile" 
        WHERE 
          "user_profile"."userId" = '9vaew1esmfme0001'
      ):: jsonb ? "note"."userHost"
    )
  ) 
  AND (
    "note"."replyUserHost" IS NULL 
    OR NOT (
      (
        SELECT 
          "user_profile"."mutedInstances" AS "user_profile_mutedInstances" 
        FROM 
          "user_profile" "user_profile" 
        WHERE 
          "user_profile"."userId" = '9vaew1esmfme0001'
      ):: jsonb ? "note"."replyUserHost"
    )
  ) 
  AND (
    "note"."renoteUserHost" IS NULL 
    OR NOT (
      (
        SELECT 
          "user_profile"."mutedInstances" AS "user_profile_mutedInstances" 
        FROM 
          "user_profile" "user_profile" 
        WHERE 
          "user_profile"."userId" = '9vaew1esmfme0001'
      ):: jsonb ? "note"."renoteUserHost"
    )
  ) 
  AND "note"."userId" NOT IN (
    SELECT 
      "blocking"."blockerId" AS "blocking_blockerId" 
    FROM 
      "blocking" "blocking" 
    WHERE 
      "blocking"."blockeeId" = '9vaew1esmfme0001'
  ) 
  AND (
    "note"."replyUserId" IS NULL 
    OR "note"."replyUserId" NOT IN (
      SELECT 
        "blocking"."blockerId" AS "blocking_blockerId" 
      FROM 
        "blocking" "blocking" 
      WHERE 
        "blocking"."blockeeId" = '9vaew1esmfme0001'
    )
  ) 
  AND (
    "note"."renoteUserId" IS NULL 
    OR "note"."renoteUserId" NOT IN (
      SELECT 
        "blocking"."blockerId" AS "blocking_blockerId" 
      FROM 
        "blocking" "blocking" 
      WHERE 
        "blocking"."blockeeId" = '9vaew1esmfme0001'
    )
  ) 
ORDER BY 
  "note"."id" DESC 
LIMIT 
  10
