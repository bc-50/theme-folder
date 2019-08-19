<?php get_header(); ?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <?php the_content(); ?>
<?php endwhile; else : ?>
    <h1><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></h1>
  <?php get_template_part('template-parts/content', 'end'); ?>
<?php endif; ?>

<?php get_footer(); ?>