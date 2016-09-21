export function render(ctx, state) {
  // Reset the canvas
  ctx.clearRect(0, 0, 300, 300);

  const { projectile } = state;
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillRect(projectile.x, projectile.y, projectile.size, projectile.size);

  const { paddle } = state;
  ctx.fillStyle = 'rgb(0,255,0)';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  const { blocks } = state;
  ctx.fillStyle = 'rgb(0,0,255)';
  blocks.forEach(block => {
    if (block === null) {
      return;
    }
    ctx.fillRect(block.x, block.y, block.w, block.h);
  });
}
