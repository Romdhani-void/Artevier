terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
module "api_gateway" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-api_gateway"
  image_tag_mutability = var.image_tag_mutability
}

module "notification_service" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-notification_service"
  image_tag_mutability = var.image_tag_mutability
}

module "order_service" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-order_service"
  image_tag_mutability = var.image_tag_mutability
}

module "product_service" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-product_service"
  image_tag_mutability = var.image_tag_mutability
}

module "user_service" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-user_service"
  image_tag_mutability = var.image_tag_mutability
}

module "frontend_ecr" {
  source = "../../modules/ecr"

  name                 = "${lower(var.project_name)}-frontend"
  image_tag_mutability = var.image_tag_mutability
}


module "network" {
  source = "../../modules/network"
  cluster_name = var.cluster_name
  vpc_cidr     = var.vpc_cidr
  subnets      = var.subnets
  azs          = var.azs
}

module "iam" {
  source = "../../modules/iam"

  cluster_name = var.cluster_name
}

module "eks" {
  source = "../../modules/eks"

  cluster_name         = var.cluster_name
  eks_version          = var.eks_version
  cluster_role_arn     = module.iam.eks_cluster_role_arn
  eks_cluster_role_arn = module.iam.eks_cluster_role_arn

  private_subnet_ids = module.network.private_subnet_ids
  eks_node_role_arn  = module.iam.eks_node_group_role_arn

  eks_node_instance_types = var.eks_node_instance_types
  node_desired_size       = var.node_desired_size
  node_max_size           = var.node_max_size
  node_min_size           = var.node_min_size

  enable_ebs_csi_driver               = var.enable_ebs_csi_driver
  enable_aws_load_balancer_controller = var.enable_aws_load_balancer_controller
  enable_external_secrets             = var.enable_external_secrets
  aws_region                          = var.aws_region
  secrets_manager_name_prefix         = "${lower(var.project_name)}/${var.environment}"

  depends_on = [module.iam]
}

module "karpenter" {
  source = "../../modules/karpenter"

  cluster_name       = var.cluster_name
  oidc_provider_arn  = module.eks.oidc_provider_arn
  oidc_provider_url  = module.eks.oidc_provider_url

  depends_on = [module.eks]
}