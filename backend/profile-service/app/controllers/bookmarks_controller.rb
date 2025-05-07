class BookmarksController < ApplicationController
  before_action :set_profile_id, only: [ index create destroy]

  # GET /bookmarks/me
  def index
    @bookmarks = Bookmark.where(profile_id: @profile_id)
    render json: @bookmarks
  end

  # POST /bookmarks/me?postId=value
  def create
    @bookmark = Bookmark.new(post_id: params[:postId], profile_id: @profile_id)

    if @bookmark.present? && @bookmark.save
      render json: @bookmark, status: :created, location: @bookmark
    else
      render json: @bookmark&.errors || { error: 'Unable to create bookmark' }, status: :unprocessable_entity
    end
  end

  # DELETE /bookmarks/me?postId=value
  def destroy
    @bookmark = Bookmark.find_by(post_id: params[:postId], profile_id: @profile_id)

    if @bookmark.present?
      if @bookmark&.destroy
        head :no_content
      else
        render json: { error: 'Bookmark could not be deleted' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Bookmark not found' }, status: :not_found
    end
  end

  private
    def set_profile_id
      @profile_id = request.headers["X-Profile-ID"]
      render json: { error: 'Profile ID not provided' }, status: :bad_request unless @profile_id
    end
end
