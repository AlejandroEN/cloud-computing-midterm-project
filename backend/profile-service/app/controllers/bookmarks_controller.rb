class BookmarksController < ApplicationController
  before_action :set_profile_id, only: %i[index create destroy]

  # GET /profiles/me/bookmarks
  def index
    @bookmarks = Bookmark.where(profile_id: @profile_id).pluck(:post_id)
    render json: @bookmarks
  end

  # POST /profiles/me/bookmarks?postId=value
  def create
    @bookmark = Bookmark.new(post_id: params[:postId], profile_id: @profile_id)

    if @bookmark.present? && @bookmark.save
      render json: @bookmark, status: :created
    else
      render json: @bookmark&.errors || { error: 'Unable to create bookmark' }, status: :unprocessable_entity
    end
  end

  # DELETE /profiles/me/bookmarks?postId=value
  def destroy
    @bookmark = Bookmark.find_by(post_id: params[:postId], profile_id: @profile_id)

    @bookmark&.destroy
    render json: { message: 'Bookmark successfully deleted' }, status: :ok

  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Bookmark not found' }, status: :not_found
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: 'Failed to delete Bookmark' }, status: :unprocessable_entity
  end

  private
    def set_profile_id
      @profile_id = request.headers["X-Profile-ID"]
      render json: { error: 'Profile ID is missing' }, status: :bad_request unless @profile_id
    end
end
