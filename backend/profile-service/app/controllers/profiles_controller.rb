class ProfilesController < ApplicationController
  before_action :set_profile, only: %i[ show update_stars ]
  before_action :set_me, only: %i[ show_me update destroy ]

  # GET /profiles/1
  def show
    render json: @profile
  end

  #GET /profiles/me
  def show_me
    render json: @profile
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
    def set_profile
      @profile = Profile.find(params.expect(:id))
    end

    def set_me
      id = request.headers["X-Profile-ID"]

      if id.present?
        @profile = Profile.find(id)
      else
        render json: { error: "Profile ID header missing" }, status: :unauthorized
      end
    end

    # Only allow a list of trusted parameters through.
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
