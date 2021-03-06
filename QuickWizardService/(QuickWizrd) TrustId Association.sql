USE [QuickWizard]
GO
/****** Object:  Table [QuickWizard].[TrustConfig]    Script Date: 9/26/2016 10:29:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[QuickWizard].[TrustConfig]') AND type in (N'U'))
BEGIN
CREATE TABLE [QuickWizard].[TrustConfig](
	[tId] [int] NOT NULL,
	[pId] [int] NOT NULL,
	[mId] [int] NOT NULL,
	[bId] [uniqueidentifier] NOT NULL
) ON [PRIMARY]
END
GO
/****** Object:  StoredProcedure [QuickWizard].[usp_GetBusinessGuid]    Script Date: 9/26/2016 10:29:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[QuickWizard].[usp_GetBusinessGuid]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [QuickWizard].[usp_GetBusinessGuid] AS' 
END
GO
ALTER PROCEDURE [QuickWizard].[usp_GetBusinessGuid]
    @tId int
   ,@pId int
   ,@mId int
   ,@bId uniqueidentifier output
AS
BEGIN

	--declare @tId int=1, @pId int=1, @mId int=1, @bId uniqueidentifier
	select @bId=bid 
	from QuickWizard.TrustConfig
	where tId=@tId and pId=@pId and mId=@mId

	if @bId is null begin
		select @bId = NEWID()
	end

	--select @bId
End


GO
/****** Object:  StoredProcedure [QuickWizard].[usp_SavePageDataTrustConfig]    Script Date: 9/26/2016 10:29:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[QuickWizard].[usp_SavePageDataTrustConfig]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [QuickWizard].[usp_SavePageDataTrustConfig] AS' 
END
GO
ALTER PROCEDURE [QuickWizard].[usp_SavePageDataTrustConfig]
    @tId int
   ,@pId int
   ,@mId int
   ,@bId uniqueidentifier
AS
BEGIN
--declare @tId int=1, @pId int=1, @mId int=1, @bId uniqueidentifier='63EB13E4-B67E-4A71-8E48-474C1C0CEBAD'
	if not exists(SELECT * FROM QuickWizard.TrustConfig
			WHERE bId=@bId and tId=@tId and pId=@pId and mId=@mId) 
	begin
		INSERT INTO QuickWizard.TrustConfig
			(bId, tId, pId, mId)
		VALUES
			(@bId, @tId, @pId, @mId)
	end
End


GO
