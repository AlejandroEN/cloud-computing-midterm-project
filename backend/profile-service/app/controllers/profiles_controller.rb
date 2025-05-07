class ProfilesController < ApplicationController
  before_action :set_profile, only: %i[ show ]
  before_action :set_self, only: %i[ show_self update destroy ]

  # GET /profiles/1
  def show
    render json: @profile
  end

  def show_self
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

  # PATCH/PUT /profiles/1
  def update
    if @profile.update(update_profile_params)
      render json: @profile
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /profiles/1
  def destroy
    @profile.destroy!
  end

  private
    def set_profile
      @profile = Profile.find(params.expect(:id))
    end

    def set_self
      id = request.headers["X-User-ID"]

      if id.present?
        @profile = Profile.find(id)
      else
        render json: { error: "User ID header missing" }, status: :unauthorized
      end
    end

    # Only allow a list of trusted parameters through.
    def create_profile_params
      params.require(:new_profile).permit(:email, :institution_id)
    end

    def update_profile_params
      params.require(:profile_update).permit(:nickname, :name, :lastname, :birthday, :gender, :new_profile_image, :stars)
    end
end
