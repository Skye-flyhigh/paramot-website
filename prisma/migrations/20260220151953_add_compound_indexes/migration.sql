-- CreateIndex
CREATE INDEX "CorrectionLog_sessionId_side_idx" ON "CorrectionLog"("sessionId", "side");

-- CreateIndex
CREATE INDEX "ServiceSession_equipmentId_status_idx" ON "ServiceSession"("equipmentId", "status");
