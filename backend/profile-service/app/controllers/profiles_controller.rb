class ProfilesController < ApplicationController
  before_action :set_profile_and_id, only: [:show, :update_stars]
  before_action :set_me_and_id, only: [:show_me, :update, :destroy]
  before_action :set_posts_api_service, only: [:show, :show_me]
  before_action :validate_internal_token, only: [:show_by_email, :create]
  before_action :set_email, only: [:show_by_email, :create]

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

  def show_by_email
    profile = Profile.find_by(email: @email)

    if profile
      render json: profile, status: :ok
    else
      render json: { error: 'Profile not found' }, status: :not_found
    end
  end

  # POST /profiles
  def create
    domain = @email.split("@").last

    institutions_id = Institution.where(domain: domain).pluck(:id)
    if institutions_id.empty?
      render json: { error: "Institution with the given domain does not exist" }, status: :not_found
      return
    end

    @profile = Profile.new(institutions_id: institutions_id, image_url: ENV["DEFAULT_PROFILE_IMAGE"])

    if @profile.save
      render json: @profile, status: :created, location: @profile
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /profiles/me
  def update
    if params[:new_profile_image].present?
      s3_service = S3Service.new
      uploaded_image_url = s3_service.upload_image(:profile_image, @profile.id, params[:new_profile_image])

      default_image_key = ENV['DEFAULT_PROFILE_IMAGE_KEY']
      old_image_key = @profile.image_url

      if old_image_key != default_image_key
        s3_service.delete_image(:profile_image, @profile.id, old_image_key)
      end

      params[:image_url] = uploaded_image_url
      params.delete(:new_profile_image)
    end

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
    render json: { message: 'Profile deleted successfully' }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: 'Failed to delete Profile' }, status: :unprocessable_entity
  end

  private
    def set_profile_and_id
      @id = params[:id]
      @profile = Profile.find(@id)
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Profile not found' }, status: :not_found
    end

    def set_me_and_id
      @id = request.headers["X-Profile-ID"]

      if @id.present?
        @profile = Profile.find(@id)
      else
        render json: { error: "Profile ID header missing" }, status: :bad_request
      end

    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Profile not found' }, status: :not_found
    end

    def set_email
      @email = params[:email]
      unless @email.present?
        render json: { error: "Email header missing" }, status: :bad_request
      end
    end

    def validate_internal_token
      internal_token = request.headers["X-Internal-Token"]
      valid_token = ENV['INTERNAL_VALID_TOKEN']

      unless internal_token.present? && valid_token.present? && ActiveSupport::SecurityUtils.secure_compare(internal_token, valid_token)
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    end

    def set_posts_api_service
      @posts_service = PostsApiService.new
    end

    def create_profile_params
      params.require(:new_profile).permit(:email)
    end

    def update_profile_params
      params.require(:profile_update).permit(:nickname, :name, :lastname, :birthday, :gender, :new_profile_image, :image_url)
    end

    def update_stars_params
      params.permit(:stars)
    end
end
