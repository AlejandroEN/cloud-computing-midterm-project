class ProfilesController < ApplicationController
  before_action :set_profile_and_id, only: %i[ show update_stars ]
  before_action :set_me_and_id, only: %i[ show_me update destroy ]
  before_action :set_posts_api_service, only: %i[ show show_me ]

  # GET /profiles/1
  def show
    response = @posts_service.get_posts_by_id(@id)
    if response.success?
      render json: @profile.merge(response.body), status: :ok
    else
      render json: { error: "Unable to fetch posts" }, status: :unprocessable_entity
    end
  end

  #GET /profiles/me
  def show_me
    response = @posts_service.get_post_me(@id)
    if response.success?
      render json: @profile.merge(response.body), status: :ok
    else
      render json: { error: "Unable to fetch posts" }, status: :unprocessable_entity
    end
  end

  # POST /profiles
  def create
    @profile = Profile.new(create_profile_params)

    if @profile.save
      render json: @profile, status: :created, location: @profile
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /profiles/me
  def update
    if @profile.update(update_profile_params)
      render json: @profile
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH /profiles/1
  def update_stars
    if @profile.update(update_stars_params)
      render json: @profile
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /profiles/me
  def destroy
    @profile.destroy!
  end

  private
    def set_profile_and_id
      @id = params[:id]
      @profile = Profile.find(@id)
    end

    def set_me_and_id
      @id = request.headers["X-Profile-ID"]

      if @id.present?
        @profile = Profile.find(@id)
      else
        render json: { error: "Profile ID header missing" }, status: :bad_request
      end
    end

    def set_posts_api_service
      @posts_service = PostsApiService.new
    end

    def create_profile_params
      params.require(:new_profile).permit(:email, :institution_id)
    end

    def update_profile_params
      params.require(:profile_update).permit(:nickname, :name, :lastname, :birthday, :gender, :new_profile_image)
    end

    def update_stars_params
      params.permit(:stars)
    end
end
