class InstitutionsController < ApplicationController
  before_action :set_institution, only: %i[ show update destroy ]
  before_action :set_own_institution, only: %i[ show_own_institution ]

  # GET institutions
  def index
    @institutions = Institution.select(:id, :name, :image_url)

    render json: @institutions
  end

  # GET institutions/1
  def show
    render json: @institution
  end

  # GET profiles/me/institutions
  def show_own_institution
    render json: { id: @institution.id, name: @institution.name, image_url: @institution.image_url }
  end

  # POST institutions
  def create
    @institution = Institution.new(create_institution_params)

    if @institution.save
      render json: @institution, status: :created, location: @institution
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT institutions/1
  def update
    if params[:new_institution_image].present?
      s3_service = S3Service.new
      uploaded_image_url = s3_service.upload_image(:institution_image, @institution.id, params[:new_institution_image])

      old_image_key = @institution.image_url

      s3_service.delete_image(:institution_image, @institution.id, old_image_key)

      params[:image_url] = uploaded_image_url
      params.delete(:new_institution_image)
    end

    if @institution.update(update_institution_params)
      render json: @institution
    else
      render json: @institution.errors, status: :unprocessable_entity
    end
  end

  # DELETE /institutions/1
  def destroy
    @institution.destroy!
  end

  private
    def set_institution
      @institution = Institution.find(params.expect(:id))
    end

    def set_own_institution
      profile_id = request.headers["X-Profile-ID"]

      if profile_id.present?
        @institution = Institution.find(profile_id)
      else
        render json: { error: "Profile ID header missing" }, status: :bad_request
      end
    end

    def create_institution_params
      params.expect(institution: [ :name, :domain, :image_url ])
    end

    def update_institution_params
      params.expect(institution: [ :name, :domain, :image_url, :new_institution_image ])
    end
end
